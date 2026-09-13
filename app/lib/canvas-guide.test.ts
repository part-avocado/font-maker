import {describe,expect,it} from 'vitest';
import { clampGuides, defaultGuides, guideLinePos, guideForCharacter, guides, guideStates, normaliseGuides } from './canvas-guide';
import { createCipheriv } from 'crypto';

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

describe('normaliseGuides', () => {
    it('retains pre-organised guides', () => {
        const guides = {ascender: 1, capHeight: 3, xHeight: 10, baseline: 20, descender: 24}
        expect(normaliseGuides(guides, 30)).toEqual(guides)
    })

    it('reorders guides which are not in order correctly', () => {
        const scrambled = {ascender: 5, capHeight: 8, xHeight: 20, baseline: 15, descender: 25 }
        const normalised = normaliseGuides(scrambled, 30);
        expect(normalised.ascender).toBeLessThanOrEqual(normalised.capHeight);
        expect(normalised.capHeight).toBeLessThanOrEqual(normalised.xHeight)
        expect(normalised.xHeight).toBeLessThanOrEqual(normalised.baseline)
        expect(normalised.baseline).toBeLessThanOrEqual(normalised.descender);
    })

    it('clamps all fields to the new height first', () => {
        const guides = {ascender:1, capHeight: 3, xHeight: 5, baseline: 8, descender: 40};
        const normalised = normaliseGuides(guides, 10);
        expect(normalised.descender).toBeLessThanOrEqual(9)
    })

    it('is idempotent', () => {
        const guides = {ascender: 5, capHeight: 8, xHeight: 20, baseline: 15, descender: 25}
        const once = normaliseGuides(guides, 30)
        expect(normaliseGuides(once, 30)).toEqual(once);
    })
})