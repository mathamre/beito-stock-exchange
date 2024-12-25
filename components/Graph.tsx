import React from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";

// Define your data
const data = [
  {
    name: "Olsen",
    value: [24.0, 26.0, 34.0],
    change: 0.25,
    numberOfStock: 8,
  },
  {
    name: "Hansen",
    value: [30.0, 35.0, 12.0],
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
    value: [12.0, 17.0],
    change: 0.1,
    numberOfStock: 12,
  },
];

const options: EChartsOption = {
  title: {
    text: "Evolution of Values\n", // Adds a newline after the title
    left: "center", // Optionally center the title
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: data.map((entry) => entry.name),
    top: "10%", // Pushes the legend below the title
  },
  xAxis: {
    type: "category",
    data: Array.from({ length: data.length }, (_, i) => i + 1), // Generates all integers as x-axis labels
    axisLabel: {
      formatter: "{value}", // Ensures integers are written as is
    },
  },
  yAxis: {
    type: "value",
  },
  series: data.map((entry) => ({
    name: entry.name,
    type: "line",
    data: entry.value,
    symbol: "none",
  })),
};

// React Component to render the chart
const Graph: React.FC = () => {
  return (
    <div>
      <ReactECharts option={options} style={{ height: 400, width: "100%" }} />
    </div>
  );
};

export default Graph;
