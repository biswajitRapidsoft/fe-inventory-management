import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// const totalQuantityPlugin = {
//   id: "totalQuantity",
//   afterDraw: (chart) => {
//     const ctx = chart.ctx;
//     const canvas = chart.canvas;
//     const total = chart.config.data.datasets[0].data.reduce(
//       (acc, val) => acc + val,
//       0
//     );

//     ctx.restore();
//     const fontSize = (canvas.width / 100).toFixed(2);
//     ctx.font = fontSize + "em sans-serif";
//     ctx.textBaseline = "middle";

//     const text = total.toString(); // Total quantity
//     const textX = Math.round((canvas.width - ctx.measureText(text).width) / 2);
//     const textY = canvas.height / 2;

//     ctx.fillText(text, textX, textY);
//     ctx.save();
//   },
// };

// ChartJS.register(totalQuantityPlugin);

export default function DoughnutChart({ todaysSales }) {
  function extractProductSales(salesData) {
    const productSales = new Map();

    salesData.forEach((sale) => {
      sale.products.forEach((product) => {
        const { productName, quantity } = product;
        if (productSales.has(productName)) {
          productSales.set(
            productName,
            productSales.get(productName) + quantity
          );
        } else {
          productSales.set(productName, quantity);
        }
      });
    });

    return productSales;
  }

  const productSales = extractProductSales(todaysSales);
  const productNames = Array.from(productSales.keys());
  const quantitiesSold = Array.from(productSales.values());

  const backgroundColorgenerator = (length) => {
    const backgroundColor = [];

    for (let index = 0; index < length; index++) {
      const randomColor = Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
      backgroundColor[index] = `#${randomColor}`;
    }
    return backgroundColor;
  };

  const backgroundColor = backgroundColorgenerator(productNames.length);

  const data = {
    labels: productNames,
    datasets: [
      {
        label: "Sales",
        data: quantitiesSold,
        backgroundColor: backgroundColor,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percent = (
              (value / quantitiesSold.reduce((a, b) => a + b, 0)) *
              100
            ).toFixed(2);
            return `${label}: ${value} (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
