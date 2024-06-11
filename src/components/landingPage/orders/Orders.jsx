import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Snackbar,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { fetchOrders } from "../../../actions/orderAction";
import * as XLSX from "xlsx";

const OrderPaginationInfo = ({ currentPage, pageSize, totalOrders }) => {
  const startOrder = currentPage * pageSize + 1;
  const endOrder = Math.min((currentPage + 1) * pageSize, totalOrders);

  return (
    <Typography variant="subtitle1" align="center">
      {startOrder}-{endOrder} out of {totalOrders}
    </Typography>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const adminDetails = JSON.parse(localStorage.getItem("loginDetails"));
  const navigate = useNavigate();
  const pageSize = 5;

  useEffect(() => {
    fetchOrderHistory();
  }, [currentPage, selectedDate]);

  const fetchOrderHistory = async () => {
    try {
      const ordersData = await fetchOrders(
        adminDetails,
        searchQuery,
        selectedDate,
        currentPage,
        pageSize
      );
      setOrders(ordersData);
      const totalOrders = ordersData[0]?.totalBills || 0;
      setTotalOrders(totalOrders);
      setTotalPages(Math.ceil(totalOrders / pageSize));
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const errorMessage = error.response.data.message;
      setError(errorMessage);
      setOpenSnackbar(true);

      if ([403, 401, 500].includes(error.response.status)) {
        localStorage.removeItem("loginDetails");
        navigate("/");
      }
    } else {
      console.error("Error fetching order history:", error.message);
    }
  };

  // const exportAllOrders = async () => {
  //   try {
  //     const allOrders = await fetchOrders(
  //       adminDetails,
  //       searchQuery,
  //       selectedDate,
  //       0,
  //       0
  //     );
  //     console.log("All orders:", allOrders);
  //     const wb = XLSX.utils.book_new();
  //     const ws = XLSX.utils.json_to_sheet(allOrders);
  //     XLSX.utils.book_append_sheet(wb, ws, "All Orders");
  //     XLSX.writeFile(wb, "all_orders.xlsx");
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };

  const exportAllOrders = async () => {
    try {
      const allOrders = await fetchOrders(
        adminDetails,
        searchQuery,
        selectedDate,
        0,
        0
      );

      const wb = XLSX.utils.book_new();

      // Iterate over each order and format the data for Excel
      allOrders.forEach((order) => {
        // Create a new worksheet for each order
        const ws = XLSX.utils.json_to_sheet([
          {
            "Order Id": order.orderId,
            "Customer Name": order.customerName,
            "Phone Number": order.phoneNo,
            Description: order.description,
            "Total Amount": order.totalAmount.toFixed(2),
            Date: new Date(order.date).toLocaleString([], {
              month: "numeric",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          },
        ]);

        // Add a row for products
        XLSX.utils.sheet_add_aoa(
          ws,
          [
            [
              "Product Id",
              "Quantity",
              "Total Price",
              "Product Code",
              "Product Name",
              "Selling Price",
            ],
            ...order.products.map((product) => [
              product.productId,
              product.quantity,
              product.totalPrice.toFixed(2),
              product.productCode,
              product.productName,
              product.sellingPrice.toFixed(2),
            ]),
          ],
          { origin: -1 }
        );

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, order.orderId);
      });

      // Create a new worksheet for total bills
      const totalBills = allOrders.reduce(
        (acc, order) => acc + (order.totalBills || 0),
        0
      );
      const totalBillsSheet = XLSX.utils.json_to_sheet([
        { "Total Bills": totalBills },
      ]);
      XLSX.utils.sheet_add_aoa(totalBillsSheet, [["Total Bills"]], {
        origin: -1,
      });
      XLSX.utils.book_append_sheet(wb, totalBillsSheet, "Total Bills");

      // Write the workbook to a file and initiate the download
      XLSX.writeFile(wb, "all_orders.xlsx");
    } catch (error) {
      handleError(error);
    }
  };

  const createOrder = () => {
    navigate("/landingpage/createorder");
  };

  const openOrderDetails = (order) => {
    navigate("/landingpage/orderhistory/orderdetails", { state: { order } });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value - 1);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(0);
    await fetchOrderHistory();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <Grid container className="order-histories-container">
      <Grid item xs={12} sx={{ height: "fit-content" }}>
        <Typography
          variant="h5"
          sx={{ textDecoration: "underline", marginBottom: "10px" }}
          textAlign="center"
        >
          Orders
        </Typography>
      </Grid>

      <Grid item container xs={12}>
        <Grid
          item
          sm={12}
          lg={6}
          sx={{ height: "fit-content", marginBottom: "10px" }}
        >
          <form className="history-search" onSubmit={handleSearch}>
            <input
              className="history-search-inp"
              type="text"
              placeholder="Search by name or code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              className="history-search-btn"
              type="submit"
              variant="contained"
              sx={{ padding: "9px 20px" }}
            >
              Search
            </Button>
          </form>
        </Grid>

        <Grid
          item
          container
          sm={12}
          lg={6}
          sx={{
            marginBottom: "10px",
            padding: "10px",
            bgcolor: "#c5dff8",
            borderRadius: "10px",
          }}
        >
          <Grid item xs={6} sm={4} className="date">
            <TextField
              id="date"
              label="Select Date"
              type="date"
              sx={{
                width: "100%",
                height: "42.5px",
                bgcolor: "#fff",
                "& .MuiInputBase-root": {
                  height: "42.5px",
                },
                "& .MuiInputLabel-root": {
                  lineHeight: "42.5px",
                },
              }}
              defaultValue={selectedDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleDateChange}
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <Button
              className="add-btn"
              onClick={createOrder}
              variant="contained"
              color="primary"
              sx={{
                padding: "9px 20px",
                width: "100%",
              }}
            >
              Create Order
            </Button>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Button
              className="export-btn"
              onClick={exportAllOrders}
              variant="contained"
              color="primary"
              sx={{
                padding: "9px 20px",
                width: "100%",
              }}
            >
              Export All
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ height: "calc(100% - 42px)" }}>
        {orders.length > 0 ? (
          <>
            <TableContainer
              component={Paper}
              className="order-history-table-container"
            >
              <Table aria-label="order history table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className="tHead">
                      <h4>Order Id</h4>
                    </TableCell>
                    <TableCell className="tHead">
                      <h4>Customer Name</h4>
                    </TableCell>
                    <TableCell className="tHead" align="center">
                      <h4>Phone Number</h4>
                    </TableCell>
                    <TableCell className="tHead" align="center">
                      <h4>Products</h4>
                    </TableCell>
                    <TableCell className="tHead" align="center">
                      <h4>Total Amount</h4>
                    </TableCell>
                    <TableCell className="tHead" align="center">
                      <h4>Remarks</h4>
                    </TableCell>
                    <TableCell className="tHead" align="center">
                      <h4>Date</h4>
                    </TableCell>
                    <TableCell className="tHead" align="center">
                      <h4>Action</h4>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="order-history-tbody">
                  {orders.map((order) => (
                    <TableRow key={order.date}>
                      <TableCell component="th" scope="row">
                        {order.orderId}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {order.customerName}
                      </TableCell>
                      <TableCell align="left">{order.phoneNo}</TableCell>
                      <TableCell align="left">
                        {order.products.length}
                      </TableCell>
                      <TableCell align="left">
                        ₹{order.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell align="left">{order.description}</TableCell>
                      <TableCell align="left">
                        {new Date(order.date).toLocaleString([], {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => openOrderDetails(order)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              xs={12}
              sx={{ mt: 2 }}
            >
              <Pagination
                count={totalPages}
                page={currentPage + 1}
                onChange={handlePageChange}
              />
              <OrderPaginationInfo
                currentPage={currentPage}
                pageSize={pageSize}
                totalOrders={totalOrders}
              />
            </Grid>
          </>
        ) : (
          <Typography textAlign="center">No orders found</Typography>
        )}
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
