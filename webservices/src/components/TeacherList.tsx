"use client"

import { PlanData } from "@/typings";

interface teacherList{
    teachers: PlanData[];
}

export default function TeacherList({ teachers }: teacherList) {
    return (
        <div className = "teacherList">
            {teachers.map((item, index) => (
                <div key={index} className = {item.Type === "wyk" ? "teacher-red" : "teacher-green"}>
                    <span>{item.Teacher}</span>
                </div>
            ))}
        </div>
    )
}