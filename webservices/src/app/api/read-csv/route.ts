import { NextRequest, NextResponse } from 'next/server';
import { readCSV } from '@/utils/csvReader';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const csvFilePath = path.join('/data/', 'dane.csv');
        let data = await readCSV(csvFilePath);

        const searchParams = request.nextUrl.searchParams;
        const selectedMajor = searchParams.get('major');
        const selectedSubject = searchParams.get('subject');

        if (selectedMajor || selectedSubject) {
            data = data.filter(item =>
                (!selectedMajor || item.Major === selectedMajor) &&
                (!selectedSubject || item.Subject === selectedSubject)
            );
            return NextResponse.json(data);
        } else {
            const simplifiedData = data.map(({ Major, Subject }) => ({ Major, Subject }));
            return NextResponse.json(simplifiedData);
        }
    } catch (error) {
        console.error('Error in GET /api/readCsv:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
