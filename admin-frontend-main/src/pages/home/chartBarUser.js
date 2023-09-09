import React from 'react';
import { Bar } from 'react-chartjs-2';

const chartBarUser = (data) => {
    const labels = [];
    const dataChart = [];
    data.map((e) => {
        labels.push(e.type);
        dataChart.push(e.value);
    });
    return (
        <Bar
            data={{
                labels: labels,
                datasets: [
                    {
                        label: 'Số lượng',
                        backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
                        data: dataChart,
                    },
                ],
            }}
            options={{
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            }}
        />
    );
};

export default chartBarUser;
