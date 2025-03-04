import path from "path";
import {readCSV} from "@/utils/csvReader";
import {removeDuplicates} from "@/utils/removeDuplicates";
import {PlanData} from "@/typings";
import {NextResponse} from "next/server";

export async function GET() {
    try {
        console.log(`${new Date().toLocaleDateString()} : Requested data from major-api`);
        const csvFilePath = path.join('/data/', 'dane.csv');
        const data = await readCSV(csvFilePath);

        const uniqMajors= Array.from(new Set(removeDuplicates<PlanData>(data, 'Major').map(item => item.Major)));

        return NextResponse.json(uniqMajors);
    }
    catch (error) {
        console.log("Error in major-api: ", error);
        return NextResponse.json({ error: "Server Error" });
    }
}