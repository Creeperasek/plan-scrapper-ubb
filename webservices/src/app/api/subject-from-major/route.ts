import {NextRequest, NextResponse} from "next/server";
import path from "path";
import {readCSV} from "@/utils/csvReader";


export async function GET(request: NextRequest) {
    try {
        console.log(`${new Date().toLocaleDateString()} : Requested data from subject-from-major-api`);
        const csvFilePath = path.join('/data/', 'dane.csv');
        const data = await readCSV(csvFilePath);


        const searchParams = request.nextUrl.searchParams;
        const searchTerm = searchParams.get('major');
        const searchType = searchParams.get('TypeOfStudies');

        console.log("Serching for: ", searchTerm)

        if (!searchTerm) {
            return {
                status: 400,
                body: JSON.stringify({error: 'No major provided'}),
            };
        }

        const subjects = Array.from(new Set(
            data
                .filter(item => item.Major.toLowerCase() === searchTerm.toLowerCase())
                .filter(item => item.TypeOfStudies === searchType.toLowerCase())
                .map(item => item.Subject)
        ));

        return NextResponse.json(subjects);
    } catch (error) {
        console.log("Error in subject-from-major-api: ", error);
        return NextResponse.json({error: 'An error occurred while processing your request'});
    }
}