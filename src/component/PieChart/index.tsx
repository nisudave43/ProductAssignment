
// React
import React from 'react';

// Next

// Constants

// Store

// Helpers

// Contexts

// Redux

// Apis

// Action

// Icon

// Layout

// Other components
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Type

// Styles

type BarPieProps = {
    data?: any;
}
    /**
     * Renders a pie chart component.
     *
     * The component expects a `data` prop that is an object where the keys are
     * the categories and the values are the counts of products in each category.
     *
     * @param {Object} props - Component props.
     * @param {Object} props.data - Object where the keys are categories and the values are the counts of products in each category.
     *
     * @returns The pie chart component.
     */
const BarPie: React.FC<BarPieProps> = (props) => {
    const {
        data,
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
    );
};

export default BarPie;
