import {NextRequest, NextResponse} from 'next/server';
import {readCSV} from '@/utils/csvReader';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        console.log(`${new Date().toLocaleDateString()} : Requested data from syllabus-api`);
        const csvFilePath = path.join('/data/', 'dane.csv');
        let data = await readCSV(csvFilePath);

        const searchParams = request.nextUrl.searchParams;

        const selectedMajor = searchParams.get('major');
        const selectedSubject = searchParams.get('subject');

        data = data.filter(item =>
            (!selectedMajor || item.Major === selectedMajor) &&
            (!selectedSubject || item.Subject === selectedSubject)
        ).sort((a, b) => b.Type.localeCompare(a.Type));

        const uniqueTeachers = new Map();

        data.forEach((entry) => {
            if (!uniqueTeachers.has(entry.Teacher)) {
              uniqueTeachers.set(entry.Teacher, entry);
            } else if (entry.Type === 'wyk') {
              uniqueTeachers.set(entry.Teacher, entry);
            }
          });
          
          const dataNoDuplicates = Array.from(uniqueTeachers.values());

        return NextResponse.json(dataNoDuplicates);

    } catch (error) {
        console.error('Error in syllabus-api:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}
