import React from "react";
import { Line } from "react-chartjs-2";

const monthAvailable = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const chartLineSumYear = (dataThisYear) => {
  const dataFetch = [];

  monthAvailable.map((e, i) => {
    const valueOfMonth = dataThisYear
      ?.filter((dt) => new Date(dt.orderDate).getMonth() + 1 === i + 1)
      ?.reduce((sum, order) => (sum = sum + order.total), 0);
    dataFetch.push({
      month: e,
      value: valueOfMonth,
    });
  });

  const labels = [];
  const dataChart = [];
  dataFetch.map((e) => {
    labels.push(e.month);
    dataChart.push(e.value);
  });
  return (
    <Line
      height={120}
      data={{
        labels: labels,
        datasets: [
          {
            tension: 0.4,
            data: dataChart,
            label: "Price",
            fill: false,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: "#FA8072",
            borderWidth: 3,
          },
        ],
      }}
      options={{
        title: {
          display: true,
          text: "World population per region (in millions)",
        },
        legend: {
          display: true,
          position: "bottom",
        },
      }}
    />
  );
};

export default chartLineSumYear;
