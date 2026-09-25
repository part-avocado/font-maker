import {describe, it, expect, vi} from 'vitest'
import {blank} from './grid'
import { buildSvg, exportSvg, pixRect} from './svg-export'
import * as dlMd from './download'

const filled = (width: number, height:number, ...cells: [number, number][]) => {
    const grid = blank(width,height)
    cells.forEach(([x,y]) => {grid[y][x] = true})
    return grid
}

describe('pixRect', () => {
    it('creates no rectangles for a blank grid', () => {
        expect(pixRect(blank(4,4), 10,0)).toEqual([]);
    })
    

    it('merges horizontal line into single rect', () => {
        const grid = filled(5,1,[0,0], [1,0], [2,0])
        const rects = pixRect(grid, 10,0)
        expect(rects).toHaveLength(1)
        expect(rects[0]).toContain('width="30"')
    })

    it('creates separat rects for non-adj. lines in the same row', () => {
        const grid = filled (5,1, [0,0], [4,0])
        expect(pixRect(grid, 10, 0)).toHaveLength(2)
    })

    it('offsets rect coordinated by padding', () => {
        const grid = filled(2,2,[0,0])
        const rects = pixRect(grid, 10,5)
        expect(rects[0]).toContain('x="5"')
        expect(rects[0]).toContain('y="5"')
    })
    it('closes a trailing line at the end of row',() => {
        const grid = filled(3,1,[1,0],[2,0])
        const rects = pixRect(grid, 10,0)
        expect(rects).toHaveLength(1);
        expect(rects[0]).toContain('width="20"')
    })
})

