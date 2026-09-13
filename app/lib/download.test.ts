import {describe, expect, it, vi} from 'vitest';
import {download} from './download';

describe('download', () => {
    it('creates an object URL for the blob, triggers and anchor click, then revokes the URL', () => {
        const blob = new Blob(['hello'], {type:'text/plain'});
        const objectUrl = 'blob:mock-url';
        const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue(objectUrl);
        const removeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
        const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
        download('report.txt', blob);
        expect(createSpy).toHaveBeenCalledWith(blob);
        expect(clickSpy).toHaveBeenCalledOnce();
        expect(removeSpy).toHaveBeenCalledWith(objectUrl);

        createSpy.mockRestore()
        removeSpy.mockRestore()
        clickSpy.mockRestore()
    });

    it('sets anchor href and dl attributes before clicking',  () => {
        const blob = new Blob(['x']);
        vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:report')
        vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
        let observedHref = ''
        let observedName = ''
        vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this:HTMLAnchorElement) {
            observedHref = this.href
            observedName = this.download
        }); download('my-font.svg', blob);
        expect(observedName).toBe('my-font.svg')
        expect(observedHref).toBe('blob:report')
        vi.restoreAllMocks()
    })
})