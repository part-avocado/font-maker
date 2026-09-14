import {chars} from './constants'
export type Grid = boolean[][];

// a
export const initA: Grid = [
    '00011000',
    '00111100',
    '01100110',
    '11000011',
    '11000011',
    '11111111',
    '11000011',
    '11000011',
    '11000011',
    '00000000',
].map((row)=> row.split('').map((x) =>x === '1'));

export const blank = (width=8, height = 10): Grid => Array.from({length: height }, () => Array(width).fill(false))
export const validGrid = (grid:unknown ):grid is Grid => Array.isArray(grid) && grid.length > 0 && Array.isArray(grid[0]) && grid[0].length > 0 && grid.every((row) => Array.isArray(row) && row.length === grid[0].length)
export const resample = (grid:Grid, width:number, height: number): Grid => Array.from({length: height}, (_, y) => Array.from({length: width }, (_,x) => 
    grid[Math.min(grid.length -1, Math.floor((y*grid.length) / height))][
        Math.min(grid[0].length- 1, Math.floor((x*grid[0].length / width)))
    ] ))

export const dilate = (grid:Grid ):Grid => 
    grid.map((row,y) => row.map((v,x) => Boolean(v || grid[y-1]?.[x] || grid[y+1]?.[x] || row[x-1] || row[x+ 1])))

export const shear = (grid: Grid,shearF= 0.18): Grid => {
    const height= grid.length
    const length =grid[0].length
    const out =blank(length, height)
    grid.forEach((row, y) =>{
        const dx = Math.round((height - 1-y) *shearF)
        row.forEach((v, x)=> {
            if (v && out[y][x+dx] !==undefined) out[y][x+ dx ] =true
        })
    })
    return out
}