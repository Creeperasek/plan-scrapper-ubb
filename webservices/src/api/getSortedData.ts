import {readCSV} from "@/api/csvReader";
import {NextApiRequest, NextApiResponse} from "next";
import path from 'path';

type Sortdata = {
    Major?: string;
    Subject?: string;
    Teacher?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method === 'POST'){
        try {
            const csvFilePath = path.join('data', 'dane.csv');
            const planData = await readCSV(csvFilePath);

            const sortData: Sortdata = req.body;

            const result = planData.filter((item) => {
                return (
                    (!sortData.Major || item.Major === sortData.Major) &&
                    (!sortData.Subject || item.Subject === sortData.Subject) &&
                    (!sortData.Teacher || item.Teacher === sortData.Teacher)
                );
            });

            res.status(200).json(result);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
    else {
        res.status(405).json({error: 'Method Not Allowed'});
    }
}
