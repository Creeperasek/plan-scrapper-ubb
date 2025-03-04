import fs from 'fs';
import csv from 'csv-parser';
import {PlanData} from '@/typings'

export async function readCSV(filepath: string): Promise<PlanData[]>{
    return new Promise<PlanData[]>((resolve, reject) =>
    {
        console.log("Reading csv file: " + filepath)
        const data: PlanData[] = [];

        fs.createReadStream(filepath)
           .pipe(csv())
           .on('data', (row) => data.push(row))
           .on('end', () => resolve(data))
           .on('error', (err: Error) => reject(err));
    });
}