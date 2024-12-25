const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

async function GetAllData() {
  try {
    //const endpointURL = `${apiBaseUrl}/data`;
    const endpointURL = `${apiBaseUrl}/data`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(endpointURL, options);

    if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`);
    }

    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error fetching risk categories:", error);
    throw error;
  }
}

export default GetAllData;
