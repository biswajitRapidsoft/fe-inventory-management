import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ todaysSales }) {
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
        backgroundColor: "blue",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sales Quantity by Product",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed.y || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%,", height: "400px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
