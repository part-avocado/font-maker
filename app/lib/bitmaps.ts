import { Grid, blank} from "./grid";

export type effectId = 
    | 'outline'
    | 'inline'
    | 'shadow-r'
    | 'shadow-d'
    | 'bold'
    | 'thin'
    | 'smooth'
    | 'despeckle'
    | 'center-h'
    | 'center-v'
    | 'trim'
    | 'baseline'
    | 'mirror';

export interface bitmapEffect {
    id: effectId
    label: string
    description: string
    selectionSafe: boolean
}

export const bitmapEffects: bitmapEffect[] = [
    {id: 'outline', label: 'Outline', description: 'Adds a 1 pixel outline around the characters.', selectionSafe: true},
    {id: 'inline', label: 'Inline', description: 'Only keeps edge-pixels.', selectionSafe:true},
    {id: 'shadow-r', label: 'Shadow (Right)', description: 'Adds a 1 pixel shadow to the right', selectionSafe:true},
    {id: 'shadow-d', label: 'Shadow (Down)', description: 'Adds 1 pxel shadow to the bottom.', selectionSafe:true},
    {id: 'bold', label: 'Embolden', description: 'Thickens by 1 pixel (to the right.', selectionSafe:true},
    {id: 'thin', label: 'Thin Out', description: 'Removes edge pixels.', selectionSafe:true},
    {id: 'smooth', label: 'Smooth Out', description: 'Fills diagonal gaps', selectionSafe:true},
    {id: 'despeckle', label: 'Despeckle', description: 'Removes isolated pixels', selectionSafe:true},
    {id: 'center-h', label: 'Center (Horizontal)', description: 'Centers pixels horizontally', selectionSafe:false},
    {id: 'center-v', label: 'Center (Vertical)', description: 'Centers pixels vertically', selectionSafe:false},
    {id: 'trim', label: 'Trim', description: 'Removes empty margins', selectionSafe: false},
    {id: 'baseline', label: 'Baseline', description: 'Aligns lowest visible row to baseline.', selectionSafe: false},
    {id: 'mirror', label: 'Mirror', description: 'Mirrors across the canvas.', selectionSafe: false}
]

export function activeCount(grid: Grid): number {
    return grid.reduce((total, row) =>total + row.filter(Boolean).length, 0)
}

