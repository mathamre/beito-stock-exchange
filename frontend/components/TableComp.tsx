import React, { useCallback, useEffect, useState } from "react";
import { Table } from "@navikt/ds-react";
import SelectNumber from "./SelectNumber";
import GetAllData from "@/pages/api/GetAllData";
import buyStocks from "@/pages/api/buyStocks";
import router from "next/router";

let data = [
  {
    name: "Olsen",
    value: [24.0, 26.0],
    change: 0.25,
    numberOfStock: 8,
    ROI: 0,
    spent: 50,
  },
  {
    name: "Hansen",
    value: [30.0, 35.0],
    change: 0.15,
    numberOfStock: 5,
    ROI: 0,
    spent: 65,
  },
  {
    name: "Johansen",
    value: [10.0, 15.0],
    change: 0.1,
    numberOfStock: 12,
    ROI: 0,
    spent: 25,
  },
  {
    name: "Thomsen",
    value: [12.0, 15.0],
    change: 0.1,
    numberOfStock: 12,
    ROI: 0,
    spent: 27,
  },
];

interface dataValues {
  name: string;
  value: Array<number>;
  change: number;
  numberOfStock: number;
  ROI: number;
  spent: number;
}

function TableComp() {
  const [newData, setNewData] = useState(data);
  const [fetchedData, setFetchedData] = useState<dataValues[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const data: dataValues[] = await GetAllData();
      console.log("Fetched Data: ", fetchedData);
      setFetchedData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }, []);

  useEffect(() => {
    console.log("fetchedData");
    fetchData();
  }, [fetchData]);

  const handleBuyStocks = async (name: string, numberOfStock: number) => {
    try {
      const payload = { name, numberOfStocks: numberOfStock };
      const result = await buyStocks(payload);

      // Update the local data after a successful response
      setNewData((prevData) =>
        prevData.map((entry) =>
          entry.name === name
            ? {
                ...entry,
                numberOfStock: entry.numberOfStock + numberOfStock,
                spent:
                  entry.spent +
                  numberOfStock * entry.value[entry.value.length - 1],
              }
            : entry
        )
      );
    } catch (error: any) {
      if (error instanceof Error) {
        if (error.message === "Not Found") {
          router.push("/404");
        } else if (error.message === "Internal Server Error") {
          router.push("/500");
        } else {
          router.push("/error");
        }
      } else {
        router.push("/error");
      }
    }
  };

  const sortedData = [...newData]
    .map((entry) => {
      const lastValue = entry.value[entry.value.length - 1] || 0;
      const totalValue = lastValue * entry.numberOfStock;
      return { ...entry, totalValue };
    })
    .sort((a, b) => b.totalValue - a.totalValue);

  return (
    <div>
      <Table zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Posisjon</Table.HeaderCell>
            <Table.HeaderCell scope="col">Investor</Table.HeaderCell>
            <Table.HeaderCell scope="col">Verdi</Table.HeaderCell>
            <Table.HeaderCell scope="col">Endring</Table.HeaderCell>
            <Table.HeaderCell scope="col">Aksjer</Table.HeaderCell>
            <Table.HeaderCell scope="col">ROI (%)</Table.HeaderCell>
            <Table.HeaderCell scope="col">Total Verdi</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kjøp Aksjer</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedData.map(
            ({ name, value, numberOfStock, ROI, totalValue, spent }, index) => {
              return (
                <Table.Row key={name}>
                  <Table.HeaderCell scope="row">{index + 1}</Table.HeaderCell>{" "}
                  {/* Position is determined dynamically */}
                  <Table.DataCell>{name}</Table.DataCell>
                  <Table.DataCell>${value[value.length - 1]}</Table.DataCell>
                  <Table.DataCell>
                    {value.length > 1 && value[value.length - 2] !== 0
                      ? (
                          value[value.length - 1] / value[value.length - 2]
                        ).toFixed(2)
                      : 0}
                    %
                  </Table.DataCell>
                  <Table.DataCell>{numberOfStock}</Table.DataCell>
                  <Table.DataCell>
                    {spent !== 0 ? (totalValue / spent).toFixed(2) : 0}
                  </Table.DataCell>
                  <Table.DataCell>${totalValue.toFixed(2)}</Table.DataCell>
                  <Table.DataCell>
                    {<SelectNumber name={name} buyStocks={handleBuyStocks} />}
                  </Table.DataCell>
                </Table.Row>
              );
            }
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

export default TableComp;
