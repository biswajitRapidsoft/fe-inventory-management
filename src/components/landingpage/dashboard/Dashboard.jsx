import React, { useEffect, useState } from "react";
import axios from "axios";
import dasimg from "../../../img/baaca0eb0e33dc4f9d45910b8c86623f0144cea0fe0c2093c546d17d535752eb-1-.jpg";
import { NavLink } from "react-router-dom";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Doughnutchart from "./Doughnutchart";
import config from "../../../config/config";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

  useEffect(() => {
    const apiUrl = `${config.baseUrl}${config.apiEndPoint.allproduct}?adminId=${loginuser.adminId}`;

    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${loginuser.jwtToken}`,
          },
        });
        setProducts(response.data);

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

    fetchData();
  }, []);

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
          <Doughnutchart />
        </div>
        <div className="doughnutchart">
          <Doughnutchart />
        </div>
      </div>
    </div>
  );
}
