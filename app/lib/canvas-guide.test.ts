import {describe,expect,it} from 'vitest';
import { clampGuides, defaultGuides, guideLinePos, guideForCharacter, guides, guideStates, normaliseGuides, guide } from './canvas-guide';
import { createCipheriv } from 'crypto';

describe('defaultGuides', () => {
    it('produces metrics in ascending order', () => {
    const metrix = defaultGuides(30);
    expect(metrix.ascender).toBeLessThanOrEqual(metrix.capHeight)
    expect(metrix.capHeight).toBeLessThanOrEqual(metrix.xHeight)
    expect(metrix.xHeight).toBeLessThanOrEqual(metrix.baseline)
    expect(metrix.baseline).toBeLessThanOrEqual(metrix.descender);
    });
 
    it('never produces a negative row given small grid height', () => {
        const metrix = defaultGuides(1);
        Object.values(metrix).forEach((value) => expect(value).toBeGreaterThanOrEqual(0));
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
        const metrix = {ascender: 1, capHeight: 3, xHeight: 10, baseline: 20, descender: 24}
        expect(normaliseGuides(metrix, 30)).toEqual(metrix)
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
        const metrix = {ascender:1, capHeight: 3, xHeight: 5, baseline: 8, descender: 40};
        const normalised = normaliseGuides(metrix, 10);
        expect(normalised.descender).toBeLessThanOrEqual(9)
    })

    it('is idempotent', () => {
        const metrix = {ascender: 5, capHeight: 8, xHeight: 20, baseline: 15, descender: 25}
        const once = normaliseGuides(metrix, 30)
        expect(normaliseGuides(once, 30)).toEqual(once);
    })
})

describe('guides', () => {
    it('returns exactly 5 guides in order', () => {
        const metrix = guide(defaultGuides(30));
        expect(metrix.map((g) => g.id)).toEqual(['ascender', 'capHeight', 'xHeight', 'baseline', 'descender'])
    })

    it('each guide has the row from input guides', () => {
        const metrix = defaultGuides(30);
        const metrics = guide(metrix)
        metrics.forEach((guide) => expect(guide.row).toBe(metrix[guide.id]))
    })
})

describe('guideLinePos', () => {
    it('renders top-edge on their own row', () => {
        const metrics = guide(defaultGuides(30))
        metrics
            .filter((guide) => guide.id === 'baseline' || guide.id === 'descender')
            .forEach((guide) => expect(guideLinePos(guide)).toBe(guide.row + 1))
    })
})