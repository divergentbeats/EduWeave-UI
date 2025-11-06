import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const data = {
    labels: ['Math', 'Science', 'English'],
    datasets: [
      {
        label: 'Grades',
        data: [85, 90, 78],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Student Grades',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">SynapseIQ Dashboard</h1>
        <div className="mb-8">
          <Bar data={data} options={options} />
        </div>
        <div className="bg-gray-100 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">AI Insights</h2>
          <p>Placeholder for AI-powered insights...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
