import { NextRequest, NextResponse } from 'next/server';
import { readCSV } from '@/utils/csvReader';

export async function GET(request: NextRequest) {
    try {
        const csvFilePath = '/data/dane.csv'
        console.log(csvFilePath);
        let data = await readCSV(csvFilePath);

        const searchParams = request.nextUrl.searchParams;
        const selectedMajor = searchParams.get('major');
        const selectedSubject = searchParams.get('subject');

        if (selectedMajor || selectedSubject) {
            data = data.filter(item =>
                (!selectedMajor || item.Major === selectedMajor) &&
                (!selectedSubject || item.Subject === selectedSubject)
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in GET /api/read-csv:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
