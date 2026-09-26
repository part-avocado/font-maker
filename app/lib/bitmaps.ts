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
    | 'basline'
    | 'mirror';

export interface bitmapEffect {
    id: effectId
    label: string
    description: string
    selectionSafe: boolean
}