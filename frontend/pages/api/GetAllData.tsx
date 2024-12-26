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
      if (response.status === 404) {
        throw new Error("Not Found");
      } else if (response.status === 500) {
        throw new Error("Internal Server Error");
      } else {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        );
      }
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error fetching risk categories:", error);
    throw error;
  }
}

export default GetAllData;
