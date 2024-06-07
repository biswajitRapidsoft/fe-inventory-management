import React, { useEffect, useState } from "react";
import axios from "axios";
import dasimg from "../../../img/baaca0eb0e33dc4f9d45910b8c86623f0144cea0fe0c2093c546d17d535752eb-1-.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import config from "../../../config/config";
import Doughnutchart from "./Doughnutchart";
import BarChart from "./Barchart";
import { Snackbar, Alert } from "@mui/material";

export default function Dashboard() {
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [todaysSales, setTodaysSales] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchBills(selectedDate);
  }, [selectedDate]);

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
      handleTokenError(error);

      console.error("Error fetching products:", error);
    }
  };

  const fetchBills = async (date) => {
    try {
      const response = await axios.get(
        `${config.baseUrl}${config.apiEndPoint.billbydate}?adminId=${loginuser.adminId}&date=${date}`,
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
      handleTokenError(error);

      console.error("Error fetching bills:", error);
    }
  };

  const handleNavigation = (sortOption) => {
    navigate("/landingpage/products", { state: { sortOption } });
  };
  const handleTokenError = (error) => {
    if (error.response) {
      const errorMessage = error.response.data.message;
      setError(errorMessage);
      setOpenSnackbar(true);

      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("loginDetails");
        navigate("/landingpage", {
          state: {
            errorMessage: "Invalid session, please login again",
          },
        });
      }
    } else {
      console.error("Error fetching order history:", error.message);
    }
    // if (
    //   (error.response && error.response.status === 403) ||
    //   (error.response && error.response.status === 401)
    // ) {
    //   localStorage.removeItem("loginuser");
    //   navigate("/landingpage", {
    //     state: {
    //       errorMessage: "Invalid session, please login again",
    //     },
    //   });
    // } else {
    //   console.error("Error:", error);
    // }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
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
        <div
          className="dashboard-stock-child"
          onClick={() => handleNavigation("outOfStock")}
        >
          <h3>Out of stock products</h3>
          <div className="dashboard-stock-count">
            <div className="danger">
              <WarningAmberIcon />
            </div>
            <h3>{outOfStockCount}</h3>
          </div>
        </div>
        <div
          className="dashboard-stock-child"
          onClick={() => handleNavigation("lowStock")}
        >
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
      <div className="date-selector" style={{ margin: "10px" }}>
        <label htmlFor="date">Select Date: </label>
        <input
          style={{ padding: "5px 10px" }}
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <div className="dashboard-chart">
        <div className="doughnutchart">
          <h1>Doughnut chart for sails of individual product</h1>
          <Doughnutchart todaysSales={todaysSales} />
        </div>
        <div className="barchart">
          <h1>Bar chart for sails of individual product</h1>
          <BarChart todaysSales={todaysSales} />
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
