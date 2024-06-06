import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import config from "../../../config/config";
import {
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  InputBase,
  Box,
} from "@mui/material";

export default function Billing() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalBills, setTotalBills] = useState(0);

  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

  const fetchBills = async () => {
    try {
      const response = await axios.get(
        `${config.baseUrl}${config.apiEndPoint.allbill}?adminId=${loginuser.adminId}&customerName=${searchQuery}&page=${page}&size=${rowsPerPage}`,
        {
          headers: { Authorization: `Bearer ${loginuser.jwtToken}` },
        }
      );
      setBills(response.data || []);
      setTotalBills(response.data[0].totalBills);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setBills([]);
      setTotalBills(0);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [loginuser.jwtToken, loginuser.adminId, page, rowsPerPage]);

  const handleAddBill = () => navigate("/landingpage/billing/app-bill");

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchBills();
  };

  const handleViewDetails = (bill) =>
    navigate(`/landingpage/billing/details`, { state: { bill } });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="billing-page">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center">
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", alignItems: "center" }}
          >
            <InputBase
              placeholder="Search bill..."
              value={searchQuery}
              onChange={handleSearchChange}
              startAdornment={<SearchIcon sx={{ mr: 1 }} />}
              sx={{
                border: "1px solid #ccc",
                borderRadius: 1,
                padding: "4px 8px",
                width: "250px",
                marginRight: 2,
              }}
            />
            <Button variant="contained" color="primary" type="submit">
              Search
            </Button>
          </form>
        </Box>
        <Button variant="contained" color="primary" onClick={handleAddBill}>
          + Add Bill
        </Button>
      </Box>

      <div className="previous-billings">
        <h1>Previous Bills</h1>
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.length > 0 ? (
                bills.map((bill) => (
                  <TableRow key={bill.transactionId}>
                    <TableCell>{bill.customerName}</TableCell>
                    <TableCell>{bill.description}</TableCell>
                    <TableCell>{bill.phoneNo}</TableCell>
                    <TableCell>
                      {new Date(bill.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{bill.totalAmount}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewDetails(bill)}
                      >
                        View More Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No bills found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[2, 5, 10]}
            component="div"
            count={totalBills}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </div>
    </div>
  );
}
