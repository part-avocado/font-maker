import { fail } from "assert";
import { request } from "http";
import { act, useEffect } from "react";

interface fontLibProp {
    query: string;
    onQueryChange: (query:string) => void;
    matches:string[];
    activeFamily:string;
    onSelect: (family:String) => void;
}

const requestedFamilies: string[] = [];
let linkTag: HTMLLinkElement | null = null;

function ensurePreviewFontsLoaded(families:string[]) {
    const unseen = families.filter((family) => !requestedFamilies.includes(family));
    if(!unseen.length) return;
    requestedFamilies.push(...unseen);
    if (!linkTag) {
        linkTag = document.createElement('link');
        linkTag.rel = 'stylesheet';
        document.head.appendChild(linkTag);
    }

    const familyParams = requestedFamilies.map((family) => `family=${encodeURIComponent(family)}:wght@400`).join('&');
    linkTag.href = `https://fonts.googleapis.com/css2?${familyParams}&display=swap`;
}

export function fontLib({query, onQueryChange, matches, activeFamily, onSelect}: fontLibProp) {
    useEffect(() => {
        ensurePreviewFontsLoaded(matches);
    }, [matches]);

    return (
        <div className="font-browser">
            <p>Font Library powered by Google Fonts</p>
            <input value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Filter by name" aria-label="Search Google Fonts" />
            <div className="font-results" aria-live="polite">
                {matches.length ? (
                    matches.map((family) => (
                        <button key={family} className={activeFamily.startsWith(family) ? 'selected-font' : ''} onClick={() => onSelect(family)}>
                            <span style={{fontFamily: `"${family}", monospace`}}>Aa</span>
                            <strong>{family}</strong>
                            <small>Use as reference</small>
                        </button>
                    ))
                ) : (
                    <p>No matches were found based on your query.</p>
                )}
            </div>
        </div>
    );
}