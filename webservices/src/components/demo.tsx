'use client';

import {useState, useEffect} from 'react';
import {PlanData} from '@/typings';

export default function DataSelector() {
    const [data, setData] = useState<PlanData[]>([]);
    const [majors, setMajors] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [selectedMajor, setSelectedMajor] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/syllabus');
            const result = await response.json();

            if (Array.isArray(result)) {
                setMajors([...new Set(result.map((item: PlanData) => item.Major))]);
                setSubjects([...new Set(result.map((item: PlanData) => item.Subject))]);
            } else {
                console.error('Unexpected data format:', result);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchFilteredData = async () => {
        const response = await fetch(`/api/syllabus?major=${selectedMajor}&subject=${selectedSubject}`);
        const filteredData = await response.json();
        setData(filteredData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchFilteredData();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <select value={selectedMajor} onChange={(e) => setSelectedMajor(e.target.value)}>
                    <option value="">Wybierz kierunek</option>
                    {majors.map((major) => (
                        <option key={major} value={major}>{major}</option>
                    ))}
                </select>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="">Wybierz przedmiot</option>
                    {subjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
                <button type="submit">Pokaż szczegóły</button>
            </form>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>
                        Kierunek: {item.Major}, Przedmiot: {item.Subject}
                        {item.Type && `, Typ: ${item.Type}`}
                        {item.Teacher && `, Nauczyciel: ${item.Teacher}`}
                    </li>
                ))}
            </ul>
        </div>
    );
}
