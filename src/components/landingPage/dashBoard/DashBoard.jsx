import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  TableContainer,
  Table,
  TableHead,
} from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getProducts, getOrderHistory } from "../../../actions/dashboardAction";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics() {
  const adminDetails = JSON.parse(localStorage.getItem("loginDetails"));
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [emergencyList, setEmergencyList] = useState([]);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [productQuantityData, setProductQuantityData] = useState({
    labels: [],
    datasets: [
      {
        label: "Quantity",
        data: [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  });
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  useEffect(() => {
    getProducts(
      adminDetails,
      setProducts,
      prepareProductQuantityData,
      handleError
    );
    getOrderHistory(adminDetails, selectedDate, setOrders, handleError);
  }, [selectedDate]);

  useEffect(() => {
    const emergencyListItems = products.filter(
      (product) => product.quantity < product.minimumQuantity
    );
    setEmergencyList(emergencyListItems);
  }, [products]);

  const prepareProductQuantityData = (products) => {
    const labels = products.map((product) => product.productName);
    const data = products.map((product) => product.quantity);

    setProductQuantityData((prevData) => ({
      ...prevData,
      labels,
      datasets: [
        {
          ...prevData.datasets[0],
          data,
        },
      ],
    }));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const navigate = useNavigate();

  const handleError = (error) => {
    if (error.response) {
      const errorMessage = error.response.data.message;
      setError(errorMessage);
      setOpenSnackbar(true);

      if (
        error.response.status === 403 ||
        error.response.status === 401 ||
        error.response.status === 500
      ) {
        localStorage.removeItem("loginDetails");
        navigate("/");
      }
    } else {
      console.error("Error fetching order history:", error.message);
    }
  };

  const calculateTotalStockAmount = (inventoryData) => {
    return inventoryData.reduce(
      (total, product) => total + product.quantity * product.costPrice,
      0
    );
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    window.history.replaceState(null, null, `?date=${newDate}`);
  };

  const calculateTotalSalesCount = (orderData) => {
    return orderData.length;
  };

  const calculateTotalSalesAmount = (orderData) => {
    return orderData.reduce((total, order) => total + order.totalAmount, 0);
  };

  const calculateTotalProfit = (inventoryData, orderData) => {
    let totalProfit = 0;
    orderData.forEach((order) => {
      order.products.forEach((product) => {
        const soldQuantity = product.quantity;
        const soldPrice = product.totalPrice;
        const costPrice = inventoryData.find(
          (item) => item.productCode === product.productCode
        ).costPrice;
        totalProfit += soldPrice - costPrice * soldQuantity;
      });
    });
    return totalProfit;
  };

  const calculateActiveProductsCount = (inventoryData) => {
    return inventoryData.filter((product) => product.isActive).length;
  };

  const totalStockAmount = calculateTotalStockAmount(products);
  const totalSalesCount = calculateTotalSalesCount(orders);
  const totalSalesAmount = calculateTotalSalesAmount(orders);
  const totalProfit = calculateTotalProfit(products, orders);
  const activeProductsCount = calculateActiveProductsCount(products);

  const productQuantities = {};
  orders.forEach((order) => {
    order.products.forEach((product) => {
      productQuantities[product.productName] =
        (productQuantities[product.productName] || 0) + product.quantity;
    });
  });

  const productRevenue = {};
  orders.forEach((order) => {
    order.products.forEach((product) => {
      productRevenue[product.productName] =
        (productRevenue[product.productName] || 0) + product.totalPrice;
    });
  });

  const productTypes = {};
  products.forEach((product) => {
    productTypes[product.productType] =
      (productTypes[product.productType] || 0) +
      orders
        .flatMap((order) => order.products)
        .filter((p) => p.productName === product.productName)
        .reduce((total, p) => total + p.totalPrice, 0);
  });

  const histogramData = {
    labels: Object.keys(productQuantities),
    datasets: [
      {
        label: "Quantity Sold",
        data: Object.values(productQuantities),
        backgroundColor: "rgba(114, 134, 211, 0.2)",
        borderColor: "rgba(114, 134, 211, 1)",
        borderWidth: 1,
      },
    ],
  };

  const histogramOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Products",
        },
      },
      y: {
        title: {
          display: true,
          text: "Quantity Sold",
        },
        beginAtZero: true,
      },
    },
  };

  const revenueDistributionByTypeData = {
    labels: Object.keys(productTypes),
    datasets: [
      {
        data: Object.values(productTypes),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#66BB6A",
          "#FFA726",
          "#8E24AA",
          "#D4E157",
        ],
      },
    ],
  };

  const doughnutOptions = {
    maintainAspectRatio: false,
  };

  return (
    <Grid
      container
      className="analytics"
      sx={{ padding: "0", bgcolor: "#fff", height: "100%", overflow: "auto" }}
    >
      <Grid
        item
        container
        xs={12}
        style={{
          padding: "10px",
          gap: 6,
          display: "flex",
          justifyContent: "space-between",
        }}
        sx={{ height: "fit-content" }}
      >
        <Grid
          item
          xs={12}
          md={3.5}
          sx={{ width: "50%" }}
          className="total-stock-amount"
        >
          <Typography variant="body1" sx={{ width: "fit-content" }}>
            Total Stock Amount:
          </Typography>
          <Typography variant="body1" sx={{ width: "fit-content" }}>
            ₹ {totalStockAmount}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3.5} className="total-sale-count">
          <Typography variant="body1" sx={{ width: "fit-content" }}>
            Total Sales Count:
          </Typography>
          <Typography variant="body1" sx={{ width: "fit-content" }}>
            {totalSalesCount}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3.5} className="sales-to-date">
          <Typography variant="body1" sx={{ width: "fit-content" }}>
            Total Sales Amount:
          </Typography>
          <Typography variant="body1" sx={{ width: "fit-content" }}>
            ₹ {totalSalesAmount}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3.5} className="total-profit">
          <Typography variant="body1" sx={{ width: "fit-content" }}>
            Total Profit:
          </Typography>
          <Typography variant="body1" sx={{ width: "fit-content" }}>
            ₹ {totalProfit}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3.5} className="active-products-count">
          <Typography variant="body1" sx={{ width: "fit-content" }}>
            Active Products Count:
          </Typography>
          <Typography variant="body1" sx={{ width: "fit-content" }}>
            {activeProductsCount}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={3.5}
          className="products-below-min-quantity-count"
        >
          <Typography variant="body1" sx={{ width: "fit-content" }}>
            Products Below Minimum Quantity:
          </Typography>
          <Typography variant="body1" sx={{ width: "fit-content" }}>
            {emergencyList.length}
          </Typography>
        </Grid>
      </Grid>

      <Grid item container xs={12} className="graphs">
        <Grid
          item
          xs={12}
          className="date-selector"
          style={{ marginTop: "20px", marginRight: "10px", textAlign: "end" }}
        >
          <TextField
            id="date"
            label="Select Date"
            type="date"
            defaultValue={selectedDate}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleDateChange}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          className="graph1"
          style={{
            height: "55vh",
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            Quantity Sold Per Product Today
          </Typography>
          <Bar data={histogramData} options={histogramOptions} />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          className="graph2"
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            Revenue Distribution by Product Type
          </Typography>
          <div style={{ flex: 1, width: "100%", maxWidth: "100%" }}>
            <Doughnut
              data={revenueDistributionByTypeData}
              options={doughnutOptions}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          className="graph3"
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            Quantity Distribution by Product
          </Typography>
          <div style={{ flex: 1, width: "100%", maxWidth: "100%" }}>
            {productQuantityData.labels.length > 0 && (
              <Doughnut
                data={productQuantityData}
                options={doughnutOptions}
                style={{ width: "100%", height: "auto" }}
              />
            )}
          </div>
        </Grid>

        <Grid item md={6} sm={12} className="recent-sales" padding={2}>
          <TableContainer
            component={Paper}
            style={{ maxHeight: 390, overflow: "auto" }}
          >
            <Table fixedHeader>
              <TableHead style={{ backgroundColor: "#7286d3" }}>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography variant="h5">Recent Sales</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Total Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>₹{order.totalAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
