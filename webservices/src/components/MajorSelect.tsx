"use client"

interface MajorSelect{
    selectedMajor: string;
    majors: string[]; 
    onChange: (major: string) => void;
}

export default function MajorSelect({selectedMajor, majors, onChange}: MajorSelect){
    return (
        <select value={selectedMajor} onChange={(e) => onChange(e.target.value)}>
            <option value="">Wybierz wydział</option>
            {majors.map((item, index) => (
                <option key={index} value={item}>{item}</option>
            ))}
        </select>
    );
}