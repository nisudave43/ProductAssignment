import React from 'react';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

const BarPie: React.FC = (props) => {

    const {
        data
    } = props;

    ChartJS.register(ArcElement, Tooltip, Legend);

    const categoryData = {
        labels: Object.keys(data), // Get the unique categories
        datasets: [
          {
            label: 'Products',
            data: Object.values(data), // Get the count of products in each category
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

    return (
        <Pie 
            data={categoryData} 
        />
    )
};

export default BarPie