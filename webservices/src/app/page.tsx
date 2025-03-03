import {readCSV} from "@/api/csvReader";
import MajorSubjectFilter from "@/components/MajorSubjectFilter"


export default async function Home() {
  const csvFilePath = '/data/dane.csv';
  const planData = await readCSV(csvFilePath);

  if (planData.length == 0) {
    console.log("something went wrong with reading the CSV file")
  }
  return (
    <>
      <MajorSubjectFilter planData={planData} />
    </>
  );
}
