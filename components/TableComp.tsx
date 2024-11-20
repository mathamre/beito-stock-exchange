import React from "react";
import { Table } from "@navikt/ds-react";

const data = [
  {
    name: "Olsen",
    value: [24.0, 26.0],
    change: 0.25,
    numberOfStock: 8,
  },
  {
    name: "Hansen",
    value: [30.0, 35.0],
    change: 0.15,
    numberOfStock: 5,
  },
  {
    name: "Johansen",
    value: [10.0, 15.0],
    change: 0.1,
    numberOfStock: 12,
  },
  {
    name: "Thomsen",
    value: [10.0, 15.0],
    change: 0.1,
    numberOfStock: 12,
  },
];

function TableComp() {
  const sortedData = [...data]
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
            <Table.HeaderCell scope="col">Total Verdi</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedData.map(
            ({ name, value, change, numberOfStock, totalValue }, index) => {
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
                  <Table.DataCell>${totalValue.toFixed(2)}</Table.DataCell>
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
