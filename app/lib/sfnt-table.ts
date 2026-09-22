import { SquareRoundCorner } from "lucide-react";

export function sfntChecksum(bytes: Uint8Array): number {
    let sum =0;
    for (let i=0; i<bytes.length; i+=4) {
        const value = ((bytes[i]?? 0) * 0x1000000) + ((bytes[i+1] ??0 ) << 16) + ((bytes[i+2] ?? 0) << 8) + (bytes[i+3] ?? 0)
        sum = (sum + value) >>> 0;
    }
    return sum;
}

export function insertSfntTable(buffer: ArrayBuffer, tag: string, data:Uint8Array): ArrayBuffer {
    const source = new DataView(buffer)
    const count = source.getUint8(4);
    const tables: {tag:string; data: Uint8Array}[] =[];
    for (let index = 0; index < count; index++) {
        const offset = 12 + index*16
        const tt = String.fromCharCode(...new Uint8Array(buffer, offset,4))
        if (tt === tag) continue
        const start = source.getUint32(offset + 8)
        const length = source.getUint32(offset +12)
        tables.push({tag: tt, data: new Uint8Array(buffer.slice(start, start+length))})
    }
    tables.push({tag,data })
    tables.sort((a,b) => a.tag < b.tag ? -1: a.tag > b.tag ? 1:0)
    const head = tables.find((table) =>table.tag === 'head')
    if (!head) throw new Error('Font is mission its head table :(')
    new DataView(head.data.buffer).setUint32(8,0)
    let offset = 12 +tables.length *16;

    // :bleh:
    const exponent = Math.floor(Math.log2(tables.length))
    const bytes = new Uint8Array(offset +tables.reduce((sum, table) =>sum + Math.ceil(table.data.length/4) *4, 0))
    const view = new DataView(bytes.buffer)
    view.setUint32(0, source.getUint16(0))
    view.setUint16(4,tables.length)
    view.setUint16(6, 2** exponent *16)
    view.setUint16(8, exponent)
    view.setUint16(10, tables.length *16 -2 ** exponent * 16)
    let headOffset =0;
    tables.forEach((table, index) => {
        const directory = 12 + index*16
        [...table.tag].forEach((char,i) =>{ bytes[directory +i] = char.charCodeAt(0);});
        view.setUint32(directory +4, sfntChecksum(table.data))
        view.setUint32(directory +8, offset)
        view.setUint32(directory +12, table.data.length)
        bytes.set(table.data, offset)
        if (table.tag === 'head') headOffset = offset;
        offset += Math.ceil(table.data.length /4)*4
    });
    view.setUint32(headOffset + 8, (0xb1b0afba - sfntChecksum(bytes)) >>> 0);
    return bytes.buffer
}