import { FormEvent, useState } from "react";

interface CharacterSidebarProp {
    visibleChars: string[];
    selected: string;
    onSelectChar: (character:string) => void;
    referenceLabel: string;
    onOpenRefSetup: () => void;
    customChars: string[];
    onAddChars: (input: string) => void;
    onRemoveChars: (character: string) => void;
}

export function characterSidebar({
    visibleChars,
    selected,
    onSelectChar,
    referenceLabel,
    onOpenRefSetup,
    customChars,
    onAddChars,
    onRemoveChars,
}: CharacterSidebarProp) {
    const [query, setQuery] = useState('');
    const [newCharacters, setNewCharacters] = useState('');
    const customSet = new Set(customChars);
    const handleAddSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!newCharacters.trim()) return;
        onAddChars(newCharacters);
        setNewCharacters('');
    };

    const trimmed = query.trim().toLowerCase();
    const matches = trimmed ? visibleChars.filter((c) => trimmed.includes(c.toLowerCase())) : visibleChars;
    const handleQueryChange = (value: string) => {
        setQuery(value);
        if (value.length !== 1) return;
        const exact = visibleChars.includes(value) ? value : visibleChars.find((c) => c.toLowerCase() === value.toLowerCase());
        if (exact) onSelectChar(exact);
    };

    return (
        <aside className="characters pane">
            <div className="panel-title">
                <span>Characters</span>
                <small>{customChars.length ? 'Latin & custom' : 'Latin'} / {visibleChars.length}</small>
            </div>
            <input className="char-search" type='text' value={query} onChange={(e) => handleQueryChange(e.target.value)} placeholder="Find" aria-label="Filter characters" /> 
            <div className="chars-grid">
                {matches.map((character) => (
                    <span key={character} className="chars-cell">
                        <button className={selected === character ? 'active' : ''} onClick={() => onSelectChar(character)}>
                            {character}
                        </button>
                        {customSet.has(character) && (
                            <button type="button" className="chars-remove" title={`Remove ${character} from character set`} aria-label={`Remove ${character}`} onClick={(e) => {e.stopPropagation(); onRemoveChars(character);}}>
                                x
                            </button>
                        )}
                    </span>
                ))}
            </div>
            {trimmed && matches.length === 0 && <p className="chars-search-empty">No matches</p>}
            <form className="chars-add" onSubmit={handleAddSubmit}>
                <input className="chars-search" type="text" value={newCharacters} onChange={(e) => setNewCharacters(e.target.value)} placeholder="Add additional characters" aria-label="Add custom characters" />
            </form>
            <div className="sidebar-bottom">
                <p>{referenceLabel ? `Reference / ${referenceLabel}` : `Draw/Erase using left/right click`}</p>
                // svg copy pasted
                <button onClick={onOpenRefSetup}>Set up references <svg width="800px" height="800px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" aria-labelledby="arrowRightTopIconTitle" stroke="#000000" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#000000"> <title id="arrowRightTopIconTitle">Arrow Right Top</title> <path d="M19 13V5h-8"/> <path stroke-linecap="round" d="M19 5l-1 1"/> <path d="M18 6L5 19"/> </svg></button>
            </div>
        </aside>
    );
}