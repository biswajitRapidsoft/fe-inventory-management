import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

export default function Billing() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get(
          "http://192.168.12.57:8080/admin/bill/all",
          {
            headers: {
              Authorization: `Bearer ${loginuser.jwtToken}`,
            },
          }
        );
        setBills(response.data);
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };

    fetchBills();
  }, [loginuser.jwtToken]);

  const handleAddBill = () => {
    navigate("/landingpage/billing/app-bill");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredBills = bills.filter(
    (bill) =>
      bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="billing-page">
      <div className="product-functionality">
        <div className="product-search">
          <input
            type="text"
            placeholder="Search bill..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <SearchIcon sx={{ fontSize: 40 }} className="search-icon" />
        </div>

        <div className="product-add">
          <button onClick={handleAddBill}>+ Add Bill</button>
        </div>
      </div>

      <div className="previous-billings">
        <h1>Previous Bills</h1>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Description</th>
              <th>Customer Number</th>
              <th>Date</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.customerName}</td>
                <td>{bill.description}</td>
                <td>{bill.customerNumber}</td>
                <td>{bill.date}</td>
                <td>{bill.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
