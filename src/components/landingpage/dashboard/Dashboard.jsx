import React, { useEffect, useState } from "react";
import axios from "axios";
import dasimg from "../../../img/baaca0eb0e33dc4f9d45910b8c86623f0144cea0fe0c2093c546d17d535752eb-1-.jpg";
import { NavLink } from "react-router-dom";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import config from "../../../config/config";
import Doughnutchart from "./Doughnutchart";
import BarChart from "./Barchart";
export default function Dashboard() {
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [todaysSales, setTodaysSales] = useState([]);
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

  useEffect(() => {
    fetchProducts();
    fetchbills();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${config.baseUrl}${config.apiEndPoint.allproduct}?adminId=${loginuser.adminId}`,
        {
          headers: {
            Authorization: `Bearer ${loginuser.jwtToken}`,
          },
        }
      );

      const outOfStock = response.data.filter(
        (product) => product.quantity === 0
      ).length;
      const lowStock = response.data.filter(
        (product) =>
          product.quantity > 0 && product.quantity <= product.minimumQuantity
      ).length;

      setOutOfStockCount(outOfStock);
      setLowStockCount(lowStock);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchbills = async () => {
    const getCurrentDateFormatted = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };
    const currentDate = getCurrentDateFormatted();

    try {
      const response = await axios.get(
        `${config.baseUrl}${config.apiEndPoint.billbydate}?adminId=${loginuser.adminId}&date=${currentDate}`,
        {
          headers: {
            Authorization: `Bearer ${loginuser.jwtToken}`,
          },
        }
      );

      const initialValue = 0;
      const sumWithInitial = response.data.reduce(
        (accumulator, currentValue) => accumulator + currentValue.totalAmount,
        initialValue
      );
      setTotalSales(sumWithInitial);
      setTodaysSales(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };
  console.log(todaysSales);
  console.log(totalSales);
  return (
    <div className="dashboard">
      <div className="dashboard-about">
        <img src={dasimg} alt="Dashboard" className="dashboard-img" />
        <div className="dashboard-about-info">
          <h1>Never worry about </h1>
          <h1>your inventory </h1>
          <NavLink to="/landingpage/billing">Create a bill</NavLink>
        </div>
      </div>

      <div className="dashboard-stock">
        <div className="dashboard-stock-child">
          <h3>Out of stock products</h3>
          <div className="dashboard-stock-count">
            <div className="danger">
              <WarningAmberIcon />
            </div>
            <h3>{outOfStockCount}</h3>
          </div>
        </div>
        <div className="dashboard-stock-child">
          <h3>Product on low stock</h3>
          <div className="dashboard-stock-count">
            <div className="less">
              <WarningAmberIcon />
            </div>
            <h3>{lowStockCount}</h3>
          </div>
        </div>
        <div className="dashboard-stock-child">
          <h3>Day's total sales</h3>
          <div className="dashboard-stock-count">
            <div className="green">
              <CurrencyRupeeIcon />
            </div>
            <h3>{totalSales}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-chart">
        <div className="doughnutchart">
          <Doughnutchart todaysSales={todaysSales} />
        </div>
        <div className="doughnutchart">
          <BarChart todaysSales={todaysSales} />
        </div>
      </div>
    </div>
  );
}
