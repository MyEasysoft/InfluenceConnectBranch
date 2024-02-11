import React from "react";
import "./styles.css";
import { Bar, char } from "react-chartjs-2";



export default function BarChart2(props){
  const {
    earnings,
    gigs,
    completed,
    pending
  } = props;

  const data = {
    labels: ["Earnings","Gigs", "Completed","Pending"],
    previousDate: {
      label: "08/10/2019 - 09/30/2019",
      dataSet: [earnings, gigs, completed, pending]
    }
  };


  return (
    <div className="App">
      <Bar
        pointStyle="star"
        data={{
          labels: data.labels,
          responsive: true,
          offset: true,
          datasets: [
            {
              label: "Gigs",
              pointStyle: "rectRounded",
              backgroundColor: "#6ED3FF",
              barThickness: 40,
              categoryPercentage: 1,
              data: data.previousDate.dataSet //From API
            }
           
          ]
        }}
        height={381}
        options={{
          offsetGridLines: true,
          drawTicks: true,
          layout: {
            padding: {
              top: 30,
              right: 40,
              bottom: 40
            }
          },
          legend: {
            display: true,
            position: "right",
            align: "start",
            labels: {
              usePointStyle: true
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                stacked: true,
                ticks: {
                  padding: 5
                },
                gridLines: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                stacked: false,
                gridLines: {
                  drawBorder: false
                },
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 6,
                  padding: 20,
                  callback(n) {
                    if (n < 1e3) return n;
                    if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K";
                  }
                }
              }
            ]
          }
        }}
      />
    </div>
  );
}
