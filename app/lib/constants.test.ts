import {describe,expect, it } from 'vitest'
import {chars, pairingLatin, unpairedChars} from './constants'

describe('Latin characters',  () => {
    it('contains only valid data/format', () => {
        expect(chars.every((character) => [...character].length === 1)).toBe(true)
        expect(pairingLatin.every((character) => [...character].length === 1)).toBe(true)
        expect(unpairedChars.every((character) => [...character].length === 1)).toBe(true)
    })
})