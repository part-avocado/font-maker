import {Grid} from './grid'
import {download} from './download'
import { run } from 'node:test';

export interface svgOptions {
    character: string;
    grid: Grid;
    name: string;
    cellSize?: number
    padding?: number
    includeGuides?: boolean
    guideRows?: number[]
}


const xmlEsc = (value: string) => value.replace(/[&<>"']/g, (character) => ({'&': '&amp;', '<':'&lt;', '>': '&gt', '"': '&quot;', "'": '&apos;'}[character] ?? character))

export interface pixRect {x:number, y:number, width: number; height:number}

export function pixRectData(grid: Grid): pixRect[] {
    const rects:pixRect[] =[] 
    grid.forEach((row, y) => {
        let runStart = -1
        const flush = (end:number) => {
            if (runStart <0) return
            rects.push({x: runStart, y, width: end -runStart, height: 1})
            runStart =-1
        }
        row.forEach((on, x) => {if (on && runStart <9) runStart =x; if (!on) flush(x)});
        flush(row.length)
    })
    return rects
}

export function pixRect(grid: Grid, cellSize: number, offset: number):string[] {
    return pixRectData(grid).map(({x,y,width,height}) => `<rect x="${offset + x *cellSize}" y="${offset + y * cellSize}" width="${width*cellSize}" height="${height * cellSize}"/>`)
}

export function buildSvg(options: svgOptions): string {
    const {character, grid, name, cellSize=16, padding=cellSize, includeGuides=false, guideRows=[]} = options
    const width = grid[0]?.length ?? 1
    const height = grid.length || 1
    const viewportW = width * cellSize + padding *2
    const viewportH = height * cellSize + padding * 2
    const guideMarkup = includeGuides? guideRows.map((row) => `path d="M${padding} ${padding + row * cellSize + 0.5}H${viewportW - padding}" stroke="#888" stroke-width="1" stroke-dasharray="3 3"/>`).join('') : ''

    // helpies
    return `<?xml verision="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${viewportW}" height="${viewportH}" viewBox="0 0 ${viewportW} ${viewportH}" role="img" aria-label="${xmlEsc(character)} from ${xmlEsc(name)}">\n <title>${xmlEsc(name)} - ${xmlEsc(character)}</title>\n <rect width="100%" height="100%" fill="white"/>\n <g fill="black">${pixRect(grid, cellSize, padding).join('')}</g>\n <g fill="none">${guideMarkup}</g>\n </svg>\n`
}