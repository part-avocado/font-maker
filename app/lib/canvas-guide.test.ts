import {describe,expect,it} from 'vitest';
import { clampGuides, defaultGuides, guideLinePos, guideForCharacter, guides, guideStates, normaliseGuides } from './canvas-guide';

describe('defaultGuides', () => {
    it('produces metrics in ascending order', () => {
    const guides = defaultGuides(30);
    expect(guides.ascender).toBeLessThanOrEqual(guides.capHeight)
    expect(guides.capHeight).toBeLessThanOrEqual(guides.xHeight)
    expect(guides.xHeight).toBeLessThanOrEqual(guides.baseline)
    expect(guides.baseline).toBeLessThanOrEqual(guides.descender);
    });
 
    it('never produces a negative row given small grid height', () => {
        const guides = defaultGuides(1);
        Object.values(guides).forEach((value) => expect(value).toBeGreaterThanOrEqual(0));
    });
});

describe('clampGuides', () => {
    it('clamps to (0, height-1) and rounds', () => {
        expect(clampGuides(-5, 10)).toBe(0)
        expect(clampGuides(100,10)).toBe(9)
        expect(clampGuides(4.6, 10)).toBe(5)
    })
})