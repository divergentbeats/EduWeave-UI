import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export const buildBarConfig = (labels: string[], data: number[]) => ({
  data: {
    labels,
    datasets: [
      {
        label: 'Scores',
        data,
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Academic Performance' }
    },
    scales: { y: { beginAtZero: true } }
  }
});

export const buildDoughnutConfig = (labels: string[], data: number[]) => ({
  data: {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ['#0ea5e9', '#38bdf8', '#93c5fd'],
        hoverOffset: 4
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
      title: { display: true, text: 'Attendance Tracker' }
    }
  }
});

export const buildRadarConfig = (labels: string[], data: number[]) => ({
  data: {
    labels,
    datasets: [
      {
        label: 'Skill Proficiency',
        data,
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgba(14, 165, 233, 1)',
        pointBackgroundColor: '#0ea5e9'
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
      title: { display: true, text: 'Skill Radar' }
    },
    elements: { line: { borderWidth: 2 } }
  }
});


