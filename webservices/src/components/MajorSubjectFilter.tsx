"use client"

import { useState, useMemo } from "react";
import {PlanData} from "@/typings"
import MajorSelect from "./MajorSelect";
import SubjectSelect from "./SubjectSelect";
import TeacherList from "./TeacherList";

interface PlanDataProps {
    planData: PlanData[]
}

export default function MajorSubjectFilter({ planData }: PlanDataProps) {
    const [selectedMajor, setSelectedMajor] = useState<string>("");
    const [selectedSubject, setSelectedSubject] = useState<string>("");

    const majors = [...new Set(planData.map((x) => x.Major))];

    const subjects = selectedMajor ? [...new Set(planData.filter((x) => x.Major == selectedMajor).map((x) => x.Subject))] : [];

    const filteredPlanData = [...new Set(planData.filter((x) => x.Major == selectedMajor && x.Subject == selectedSubject).sort((a, b) => b.Type.localeCompare(a.Type)))];

    const uniqueTeachers = new Map();

    filteredPlanData.forEach((entry) => {
        if (!uniqueTeachers.has(entry.Teacher)) {
          uniqueTeachers.set(entry.Teacher, entry);
        } else if (entry.Type === 'wyk') {
          uniqueTeachers.set(entry.Teacher, entry);
        }
      });
      
      const PlanDataDuplicates = Array.from(uniqueTeachers.values());

    return (
        <div>
            <h2>Wydział: </h2>
            <MajorSelect majors={majors} selectedMajor={selectedMajor} onChange={setSelectedMajor} /> <br/>
            <h2>Przedmiot: </h2>
            <SubjectSelect selectedSubject={selectedSubject} subjects={subjects} onChange={setSelectedSubject}/>
            <TeacherList teachers={PlanDataDuplicates} />
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