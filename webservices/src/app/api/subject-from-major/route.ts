import {NextRequest, NextResponse} from "next/server";
import path from "path";
import {readCSV} from "@/utils/csvReader";
import {filePath} from "../../../../config";


export async function GET(request: NextRequest) {
    try {

        console.log(`${new Date().toLocaleDateString()} : Requested data from subject-from-major-api`);
        const csvFilePath = path.join(filePath.csv);



        const searchParams = request.nextUrl.searchParams;
        const searchTerm = searchParams.get('major');
        const searchType = searchParams.get('type-of-studies');


        if (!searchTerm) {
            console.error(`${new Date().toLocaleDateString()} : Search major not specified`)
            return NextResponse.json({error: 'No major provided'})
        }

        if (!searchType) {
            console.error(`${new Date().toLocaleDateString()} : Search TypeOfStudies not specified`)
            return NextResponse.json({error: 'No TypeOfStudies provided'})
        }

        console.log("Serching for: ", searchTerm + " " + searchType)

        const data = await readCSV(csvFilePath);


        const subjects = Array.from(new Set(
            data
                .filter(item => item.Major.toLowerCase() === searchTerm.toLowerCase())
                .filter(item => item.TypeOfStudies.toLowerCase() === searchType.toLowerCase())
                .map(item => item.Subject)
        ));

        return NextResponse.json(subjects);
    } catch (error) {
        console.log("Error in subject-from-major-api: ", error);
        return NextResponse.json({error: 'An error occurred while processing your request'});
    }
}