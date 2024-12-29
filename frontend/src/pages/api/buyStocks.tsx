const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

interface BuyRequest {
  name: string;
  numberOfStocks: number;
}
async function buyStocks(data: BuyRequest) {
  const endpointURL = `${apiBaseUrl}/buy`;

  try {
    const res = await fetch(endpointURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Not Found");
      } else if (res.status === 500) {
        throw new Error("Internal Server Error");
      } else {
        throw new Error(
          `HTTP error! status: ${res.status} - ${res.statusText}`
        );
      }
    }

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Now TypeScript knows 'error' has a 'message' property
      throw new Error(`Fetch error: ${error.message}`);
    }
    // Handle cases where 'error' is not an instance of 'Error'
    throw new Error("An unknown error occurred during the fetch operation");
  }
}

export default buyStocks;
