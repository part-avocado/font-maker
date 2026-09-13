export type guideId = 'ascender' | 'capHeight' | 'xHeight' | 'baseline' | 'descender';

export interface CanvasGuides {
    ascender: number;
    capHeight: number;
    xHeight: number;
    baseline: number;
    descender: number;
}

export interface guides {
    id: guideId
    label: string
    row: number
    description: string
}

export const guideLabels: Record<guideId, string> = {
    ascender: 'Ascender', capHeight: 'Cap Height', xHeight: 'X-Height', baseline: 'Baseline', descender: 'Descender',
}

// this function is mostly figma computed styles
export function defaultGuides(height: number): CanvasGuides {
    const max = Math.max(1, height -1);
    return {
        ascender: Math.max(0, Math.round(max * 0.12)), 
        capHeight: Math.max(0, Math.round(max * 0.2)),
        xHeight: Math.max(0, Math.round(max * 0.48)),
        baseline: Math.max(0, Math.round(max * 0.82)),
        descender: Math.max(0,  Math.round(max * 0.94))
    };
}

export function clampGuides(value:number, height:number): number {
    return Math.max(0,Math.min(Math.max(0,height -1), Math.round(value)))
}

export function normaliseGuides(guides: CanvasGuides, height: number): CanvasGuides {
    const values = (Object.keys(guideLabels) as guideId[]).map((id) => [id, clampGuides(guides[id], height)] as const);
    const out = Object.fromEntries(values) as unknown as CanvasGuides;
    return {
        ascender: Math.min(out.ascender, out.capHeight),
        capHeight: Math.max(out.ascender, Math.min(out.capHeight, out.xHeight)),
        xHeight: Math.max(out.capHeight, Math.min(out.xHeight, out.baseline)),
        baseline: Math.max(out.xHeight, Math.min(out.baseline, out.descender)),
        descender: Math.max(out.baseline, out.descender)
    }
}

export function guide(guides: CanvasGuides): guides[] {
    return [
        {id: 'ascender', label: guideLabels.ascender, row: guides.ascender, description: 'Alignment for letters such as b, d, h, k, and l.'},
        {id: 'capHeight', label: guideLabels.capHeight, row: guides.capHeight, description: 'Alignment for capital letters.'},
        {id: 'xHeight', label: guideLabels.xHeight, row: guides.xHeight, description: 'Alignment for lowercase characters such as a, n, c, and o.'},
        {id: 'baseline', label: guideLabels.baseline, row: guides.baseline, description: 'Baseline for most characters.'},
        {id: 'descender', label: guideLabels.descender, row: guides.descender, description: 'Bottom alignment for letters such as g, j, p, q, and y.'},
    ]
}

const bottomEdgeGuides: guideId[] = ['baseline', 'descender'];

export function guideLinePos(guide: guides): number {
    return bottomEdgeGuides.includes(guide.id) ? guide.row +1 : guide.row;
}
export function guideForCharacter(character:string): guideId[] {
    // begin copy-paste usage
    if (/^[A-ZÀ-Ý]$/.test(character)) return ['capHeight', 'baseline'];
    if (/^[bdfhklt]$/.test(character)) return ['ascender', 'baseline'];
    if (/^[gjpqy]$/.test(character)) return ['xHeight', 'descender'];
    if (/^[a-zà-ÿ]$/.test(character)) return ['xHeight', 'baseline'];
    if (/^\d$/.test(character)) return ['capHeight', 'baseline'];
    return ['baseline'];
    // end copy-paste usage
}
export function guideStates(guides: CanvasGuides, height: number): string[] {
    const warnings: string[] = [];
    const normalized = normaliseGuides(guides, height);
    if (normalized.baseline >= height -1) warnings.push("Baseline coincides with bottom edge.")
    if (normalized.capHeight === normalized.xHeight) warnings.push("Cap Height and X-Height coincide.")
    if (normalized.baseline === normalized.descender) warnings.push("There is no space for the descender.")
    return warnings
}