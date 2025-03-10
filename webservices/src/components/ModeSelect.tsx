"use client"

interface ModeSelect {
    selectedMode: string;
    onChange: (mode: string) => void;
}

export default function ModeSelect({selectedMode, onChange}: ModeSelect) {
    return (
        <select value={selectedMode} onChange={(e) => onChange(e.target.value)}>
            <option value="">Wybierz tryb</option>
            <option value="Stacjonarne">Stacjonarne</option>
            <option value="Zaoczne">Zaoczne</option>
            <option value="Wieczorowe">Wieczorowe</option>
        </select>
    );
}