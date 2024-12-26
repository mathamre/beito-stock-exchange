import React from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";

interface DataValues {
  name: string;
  value: number[];
  change: number;
  numberOfStock: number;
}

interface GraphProps {
  data: DataValues[];
}

const Graph: React.FC<GraphProps> = ({ data }) => {
  // Limit to the last 100 y-axis values across all series
  const allValues = data.flatMap((entry) => entry.value.slice(-100));

  // Calculate global min/max for y-axis
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);

  const yAxisMin = globalMin - (globalMax - globalMin) * 0.1;
  const yAxisMax = globalMax + (globalMax - globalMin) * 0.1;

  const options: EChartsOption = {
    title: {
      text: "Aksjepris over tid\n",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: data.map((entry) => entry.name),
      top: "10%",
    },
    xAxis: {
      type: "category",
      data: Array.from({ length: 100 }, (_, i) => i + 1), // Dynamically calculate x-axis labels for the last 100 points
      axisLabel: { show: true },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: "value",
      min: Math.floor(yAxisMin),
      max: Math.ceil(yAxisMax),
    },
    series: data.map((entry) => ({
      name: entry.name,
      type: "line",
      data: entry.value.slice(-100), // Align y-axis values with the last 100 points
      symbol: "none",
    })),
  };

  return (
    <div style={{ margin: "5%" }}>
      <ReactECharts option={options} style={{ height: 400, width: "100%" }} />
    </div>
  );
};

export default Graph;
