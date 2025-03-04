"use client"

interface SubjectSelect {
    selectedSubject: string;
    subjects: string[];
    onChange: (subject: string) => void;
}

export default function SubjectSelect({selectedSubject, subjects, onChange}: SubjectSelect) {
    return (
        <select value={selectedSubject} onChange={(e) => onChange(e.target.value)}>
            <option value="">Wybierz przedmiot</option>
            {subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
            ))}
        </select>
    );
};