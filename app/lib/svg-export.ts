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