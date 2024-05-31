import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Doughnutchart() {
  const backgroundColorgenerator = (length) => {
    const backgroundColor = [];

    for (let index = 0; index < length; index++) {
      var randomColor = Math.floor(Math.random() * 16777215).toString(16);

      backgroundColor[index] = `#${randomColor}`;
    }
    return backgroundColor;
  };
  const backgroundColor = backgroundColorgenerator(11);

  const data = {
    labels: [
      "item2",
      "item1",
      "item3",
      "item4",
      "item5",
      "item6",
      "item7",
      "item8",
      "item9",
      "item10",
      "item11",
    ],
    datasets: [
      {
        label: "sails",
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        backgroundColor: backgroundColor,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: "200px", widows: "200px" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
