export interface Presets{id: string; label:string; text:string; description: string;}

export const typePresets[] = [
    {id: 'pangram', label: 'Pangram', text: 'THE QUICK BROWN FOX \n JUMPS VER THE LAZY GOD.', description: 'Uppercase English coverage.'},
    {id: 'pangram-l', label: 'Pangram - Lowercase', text: 'sphinx of black quartz, judge my vow.', description: 'Lowercase English coverage.'},
    {id: 'numbers', label: 'Numerals', text: '0123456789\n$12.50 42% #100', description: 'Figures and common punctuation.'},
    {id: 'spaces', label: 'Spaces', text: 'AV AW AY TA To \nmm nn il 00 88 fi', description: "Spacing tests."},
]

export function findPreset(id:string): Presets | undefined {return typePresets.find((preset: { id: string; }) => preset.id === id)}