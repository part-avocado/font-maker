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

//begin copy
export const letterSeed: Record<string, string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
  '6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
  '.': ['00000', '00000', '00000', '00000', '00000', '00110', '00110'],
  ',': ['00000', '00000', '00000', '00000', '00000', '00110', '00100'],
  '!': ['00100', '00100', '00100', '00100', '00100', '00000', '00100'],
  '@': ['01110', '10001', '10111', '10101', '10111', '10000', '01111'],
  '#': ['01010', '11111', '01010', '01010', '11111', '01010', '00000'],
  '&': ['01100', '10010', '10100', '01000', '10101', '10010', '01101'],
  '?': ['01110', '10001', '00010', '00100', '00100', '00000', '00100'],
};
//end copy

export const seed = (letter:string, w= 8, h =10):Grid => {
    const pattern = letterSeed[letter.toUpperCase()] || letterSeed['?']
    return Array.from({length: h}, (_, y) => 
    Array.from({length: w}, (_,x) => pattern[Math.min(6, Math.floor((y* 7) / h))][Math.min(4, Math.floor((x* 5) /w))] ==='1'))
}

export const missingLetterBox =(width:number, height: number): Grid => {
    const insetx = Math.max(1, Math.round(width*0.12))
    const insety = Math.max(1, Math.round(height* 0.08))
    const left = insetx
    const right = width - 1 -insetx
    const top =insety
    const bottom= height-1 -insety
    return Array.from({length:height}, (_,y) =>
        Array.from({length:width}, (_, x) => {
            if (x<left || x >right || y<top ||y > bottom) return false;
            return x ===left || x=== right || y=== top || y=== bottom;
    }),
);
};

export const defaultLetter = (width:number, height: number): Record<string, Grid> => Object.fromEntries(chars.map((chars) => [chars, blank(width,height)]))