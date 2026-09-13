import { useRef, useState } from "react";
import { createPortal} from "react-dom";
import { HelpCircle } from "lucide-react";
interface helperProps {
    text: string;
}

const BUBBLE_WIDTH = 210; // Should be at 210, computed by figma
const VIEWPORT_MARGIN = 10; // Shuld be 10, comnputed by figma

interface BubblePos {
    left: number;
    top?: number;
    bottom?: number;
}

export function hints({text}: helperProps) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState<BubblePos | null>(null);
    const show = () => {
        const rect = triggerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const left = Math.min(Math.max(rect.left, VIEWPORT_MARGIN), window.innerWidth - BUBBLE_WIDTH - VIEWPORT_MARGIN);
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        if (spaceBelow >= spaceAbove) setPosition({left, top: rect.bottom + 8});
        else setPosition({left, bottom: window.innerHeight - rect.top +8})
    };
    const hide = () => setPosition(null);

    return (
        <span className="help-hint">
            <button ref = {triggerRef} type="button" className="help-hint-tg" aria-label={`What's this? ${text}`} onClick={(e) => e.stopPropagation()} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
                <HelpCircle size={14} aria-hidden="true" />
            </button>
            {position && 
            createPortal(
            <span className="help-hint-bubble" 
            role="tooltip" style={{top: position.top, bottom: position.bottom, left:position.left, maxWidth: BUBBLE_WIDTH, maxHeight: `min(320px, ${Math.max(window.innerHeight - VIEWPORT_MARGIN * 2, 120)}px)`}}>
                {text}
        </span>,
        document.body
    
    )}
    </span>
    );
}