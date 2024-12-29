import React, { useEffect, useState } from "react";
import { Table } from "@navikt/ds-react";
import InputNumber from "./InputNumber";
import BuyStocksClient from "@/src/pages/api/BuyStocksClient";

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
  fetchData: () => void;
}

function TableComp({ tableData, fetchData }: Props) {
  const [newData, setNewData] = useState<dataValues[]>(tableData || []);

  useEffect(() => {
    setNewData(tableData);
  }, [tableData]);
  const handleBuyStocks = async (name: string, numberOfStock: number) => {
    const payload = { name, numberOfStocks: numberOfStock };
    await BuyStocksClient(payload);
    fetchData();
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
            <Table.HeaderCell scope="col">Aksjer</Table.HeaderCell>
            <Table.HeaderCell scope="col">ROI (%)</Table.HeaderCell>
            <Table.HeaderCell scope="col">Total Verdi</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kjøp Aksjer</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedData.map(
            ({ name, value, numberOfStock, totalValue, spent }, index) => {
              return (
                <Table.Row key={name}>
                  <Table.HeaderCell scope="row">{index + 1}</Table.HeaderCell>
                  <Table.DataCell>{name}</Table.DataCell>
                  <Table.DataCell>${value[value.length - 1]}</Table.DataCell>
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
