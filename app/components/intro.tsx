import {useModalDialog} from '../hooks/useModalDialog'

interface introPanel {
    onClose: () => void
    onBegin: () => void
    onUseFile: () => void;
}

export function introductionPanel({onClose, onBegin, onUseFile}: introPanel) {
    const dialogRef = useModalDialog<HTMLElement>(onClose);
    return (
        <section ref={dialogRef} tabIndex={-1} className="intro" role="dialog" aria-modal="true">
            <p className="eyebrow">
                fontmaker @ <strong>introduction</strong>
            </p>
            <h2>
                make fonts
                <br />
                for all
            </h2>
            <div className="intro-actions">
                <button className="solid" onClick={onBegin}>
                    start here
                </button>
                <button className="outline" onClick={onUseFile} title="Start from pre-existing media">
                    already have a reference?
                </button>
            </div>
            <p className="intro-note">made by <a href="https://github.com/part-avocado">@part-avocado</a></p>
        </section>
    )
}