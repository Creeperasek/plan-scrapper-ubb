"use client"

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {PlanData} from "@/typings"
import MajorSelect from "./MajorSelect";
import SubjectSelect from "./SubjectSelect";
import TeacherList from "./TeacherList";


export default function MajorSubjectFilter() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const [planData, setPlanData] = useState<PlanData[]>([]);
    const [majors, setMajors] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    
    const selectedMajor = searchParams.get("major") || "";
    const selectedSubject = searchParams.get("subject") || "";

    useEffect(() => {
        if (selectedMajor && selectedSubject){
            fetch(`/api/syllabus?major=${selectedMajor}&subject=${selectedSubject}`)
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
        if (selectedMajor) {
            fetch(`/api/subject-from-major?major=${selectedMajor}`)
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
            <h2>Wydział: </h2>
            <MajorSelect majors={majors} selectedMajor={selectedMajor} onChange={(x) => updateParams("major", x)} /> <br/>
            <h2>Przedmiot: </h2>
            <SubjectSelect selectedSubject={selectedSubject} subjects={subjects} onChange={(x) => updateParams("subject", x)}/>
            <TeacherList teachers={planData} />
            <div className = "legend">
                <div className = "LegendBox"></div>
                <span>Prowadzący przedmiot</span>
            </div>
            <div className = "legend">
                <div className = "LegendBoxGreen"></div>
                <span>Pozostali prowadzący</span>
            </div>
        </div>
    );
};