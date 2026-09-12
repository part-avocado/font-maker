import {act, RefObject, useEffect, useRef} from 'react';
const SELECTOR = ['a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'summary', '[tabindex]:not([tabindex="-1"])',].join(',')

// wah ts took much too long to make
function focusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(SELECTOR)).filter((element) => {
        if (element.matches(':disabled, [tabindex="-1"], input[type="hidden"]')) return false;
        for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
            if (ancestor.hidden || ancestor?.hasAttribute('inert') || ancestor?.getAttribute('aria-hidden') === 'true') return false;
            const style = getComputedStyle(ancestor);
            if (style.display === 'none' || style.visibility === 'hidden') return false;
            if (ancestor.tagName === 'DETAILS' && !ancestor?.hasAttribute('open')) {
                const summary = ancestor?.querySelector(':scope > summary');
                if (!summary?.contains(element)) return false
            }
            if (ancestor === container) break;
        }
        return true;
    });
}

let nextDialogId = 0;
const openDialogStack: Array<{id:number; container:HTMLElement | null}> = [];

export function editorShortcutsAllowed(): boolean {
    const topmost = openDialogStack.at(-1);
    return !topmost || topmost.container?.dataset.editorShortcuts === 'true'
}

export function useModalDialog<T extends HTMLElement>(onClose: () => void): RefObject<T | null> {
    const containerRef = useRef<T | null>(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        const container = containerRef.current;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        const id = nextDialogId++;
        openDialogStack.push({id, container});

        const initial = container ? focusableElements(container) : [];
        (initial[0] ?? container)?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (openDialogStack.at(-1)?.id !== id) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onCloseRef.current();
                return;
            }
            if (e.key !== 'Tab' || !container) return;
            const focusable = focusableElements(container);
            if (focusable.length === 0) {
                e.preventDefault()
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;
            if (e.shiftKey) {
                if (active === first || !container.contains(active)) {
                    e.preventDefault();
                    last.focus();
                }
            } else if (active === last || !container.contains(active)) {
                e.preventDefault();
                first.focus();
            }
        };
         
        document.addEventListener('keydown', handleKeyDown, true);
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            const index = openDialogStack.findIndex((entry) => entry.id === id);
            if (index !== -1) openDialogStack.splice(index, 1);
            if (previouslyFocused?.isConnected) previouslyFocused.focus();
        };
    }, []);

    return containerRef;
}