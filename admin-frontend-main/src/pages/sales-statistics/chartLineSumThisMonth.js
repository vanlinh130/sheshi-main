import React from "react";
import { Line } from "react-chartjs-2";

function getDaysInMonthUTC(month, year) {
  const date = new Date(Date.UTC(year, month, 1));
  const days = [];
  while (date.getUTCMonth() === month) {
    days.push(new Date(date).getDate());
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return days;
}

const chartLineSumThisMonth = (dataThisMonth) => {
  const date = new Date()
  const days = getDaysInMonthUTC(date.getMonth(), date.getFullYear());
  const dataFetch = []

  days.map((e) => {
    const valueOfDate = dataThisMonth
      ?.filter((dt) => new Date(dt.orderDate).getDate() === e)
      ?.reduce((sum, order) => (sum = sum + order.total), 0);
    dataFetch.push({
      day: e + "/" + (date.getMonth() + 1),
      value: valueOfDate,
    });
  })

  const labels = []
  const dataChart = []
  dataFetch.map((e) => {
    labels.push(e.day)
    dataChart.push(e.value)
  })
  return (
    <Line
      height={120}
      data={{
        labels: labels,
        datasets: [
          {
            tension: 0.4,
            data: dataChart,
            label: "TOTAL",
            fill: true,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
          },
        ],
      }}
      options={{
        animation: true,
      }}
    />
  );
};

export default chartLineSumThisMonth;
