"use client"

import {PlanData} from "@/typings"

interface PlanDataProps {
    planData: PlanData[]
}

export default function DemoPlan({planData}: PlanDataProps) {
    return (
        <table>
            <tbody>
                {planData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.Major}</td>
                        <td>{item.Subject}</td>
                        <td>{item.Type}</td>
                        <td>{item.Teacher}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}