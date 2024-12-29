import React, { useCallback, useEffect, useState } from "react";
import TableComp from "./TableComp";
import Graph from "./Graph";
import GetAllData from "@/src/pages/api/GetAllData";

interface dataValues {
  name: string;
  value: Array<number>;
  change: number;
  numberOfStock: number;
  ROI: number;
  spent: number;
}

function MainComponent() {
  const [newData, setNewData] = useState<dataValues[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const data: dataValues[] = await GetAllData();
      setNewData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 100);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <TableComp tableData={newData} fetchData={fetchData} />
          <Graph data={newData} />
        </>
      )}
    </div>
  );
}

export default MainComponent;
