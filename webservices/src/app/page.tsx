import {readCSV} from "@/api/csvReader";
import DemoPlan from "@/components/demo"


export default async function Home() {
  const csvFilePath = '/data/dane.csv';
  const planData = await readCSV(csvFilePath);

  if (planData.length == 0) {
    console.log("something went wrong with reading the CSV file")
  }

  return (
    <>
      <DemoPlan planData={planData}/>
    </>
  );
}
