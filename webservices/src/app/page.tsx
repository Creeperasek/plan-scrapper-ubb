import DemoPlan from "@/components/demo"

async function getData(){
  try {
    const response = await fetch('http://localhost:3000/api/getSortedData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Major: 'Inf',
        Subject: 'Interfejs w aplikacjach internetowych'
      })
    });

    if(!response.ok){
      console.log(`Response failed with status ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return [];
  }
}

export default async function Home() {
  const planData = await getData();
  if (planData.length === 0) {
    console.log("No data returned or error occurred");
  }

  return (
      <>
        <DemoPlan planData={planData}/>
      </>
  );
}
