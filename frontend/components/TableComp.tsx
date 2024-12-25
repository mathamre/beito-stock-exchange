import React, { useCallback, useEffect, useState } from "react";
import { Table } from "@navikt/ds-react";
import SelectNumber from "./SelectNumber";
import GetAllData from "@/pages/api/GetAllData";
import buyStocks from "@/pages/api/buyStocks";
import router from "next/router";
import InputNumber from "./InputNumber";

interface dataValues {
  name: string;
  value: Array<number>;
  change: number;
  numberOfStock: number;
  ROI: number;
  spent: number;
}

interface Props {
  tableData: dataValues[];
}

function TableComp({ tableData }: Props) {
  const [newData, setNewData] = useState<dataValues[]>(tableData || []);
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
                  <Table.HeaderCell scope="row">{index + 1}</Table.HeaderCell>
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
                    {<InputNumber name={name} buyStocks={handleBuyStocks} />}
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
