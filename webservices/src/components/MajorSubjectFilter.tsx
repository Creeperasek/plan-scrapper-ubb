"use client"

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {PlanData} from "@/typings"
import MajorSelect from "./MajorSelect";
import SubjectSelect from "./SubjectSelect";
import TeacherList from "./TeacherList";
import ModeSelect from "./ModeSelect";


export default function MajorSubjectFilter() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const [planData, setPlanData] = useState<PlanData[]>([]);
    const [majors, setMajors] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    
    const selectedMajor = searchParams.get("major") || "";
    const selectedSubject = searchParams.get("subject") || "";
    const selectedMode = searchParams.get("type-of-studies") || "";

    useEffect(() => {
        if (selectedMajor && selectedSubject && selectedMode) {
            fetch(`/api/syllabus?major=${selectedMajor}&subject=${selectedSubject}&type-of-studies=${selectedMode}`)
            .then((res) => res.json())
            .then(setPlanData);
        }else{
            setPlanData([]);
        }

    }, [selectedMajor, selectedSubject]);

    useEffect(() => {
        fetch('/api/major')
            .then((res) => res.json())
            .then(setMajors);
    }, []);

    useEffect(() => {
        if (selectedMajor && selectedMode) {
            fetch(`/api/subject-from-major?major=${selectedMajor}&type-of-studies=${selectedMode}`)
                .then((res) => res.json())
                .then(setSubjects);
        }else{
            setSubjects([]);
        }
    }, [selectedMajor]);

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        value ? params.set(key, value) : params.delete(key);
        replace(`?${params.toString()}`);
    };
    
    return (
        <div>
            <h2>Tryb studiów: </h2>
            <ModeSelect selectedMode={selectedMode} onChange={(x) => updateParams("type-of-studies", x)} /> <br />
            <h2>Kierunek: </h2>
            <MajorSelect majors={majors} selectedMajor={selectedMajor} onChange={(x) => updateParams("major", x)} /> <br/>
            <h2>Przedmiot: </h2>
            <SubjectSelect selectedSubject={selectedSubject} subjects={subjects} onChange={(x) => updateParams("subject", x)}/>

            <TeacherList teachers={planData} />
            <div className="legend">
                <div className="LegendBox"></div>
                <span>Prowadzący przedmiot</span>
            </div>
            <div className="legend">
                <div className="LegendBoxGreen"></div>
                <span>Pozostali prowadzący</span>
            </div>
        </div>
    );
};