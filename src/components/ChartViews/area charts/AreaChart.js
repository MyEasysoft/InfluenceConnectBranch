import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut,Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function AreaChart(props) {
  const {
    earnings,
    gigs,
    completed,
    pending
  } = props;


  const data = {
    labels: ["Earnings",'Gigs', 'Completed', 'Pending'],
    datasets: [
      {
        label: '# of Votes',
        data: [earnings, gigs, completed, pending],
        backgroundColor: [
          'rgba(0, 212, 38, 0.5)',
          'rgba(212, 0, 184, 0.5)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(212, 0, 0, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(0, 212, 38, 1)',
          'rgba(212, 0, 184, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(212, 0, 0, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut data={data} />;
}
