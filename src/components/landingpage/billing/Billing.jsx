import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import config from "../../../config/config";

export default function Billing() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get(
          `${config.baseUrl}${config.apiEndPoint.allbill}?adminId=${loginuser.adminId}&page=0&size=5`,
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
  }, [loginuser.jwtToken, loginuser.adminId]);

  const handleAddBill = () => {
    navigate("/landingpage/billing/app-bill");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = (bill) => {
    console.log(bill);
    navigate(`/landingpage/billing/details`, { state: { bill } });
  };

  const filteredBills = bills.filter(
    (bill) =>
      bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.date.toLowerCase().includes(searchQuery.toLowerCase())
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.customerName}</td>
                <td>{bill.description}</td>
                <td>{bill.phoneNo}</td>
                <td>{new Date(bill.date).toLocaleDateString()}</td>
                <td>{bill.totalAmount}</td>
                <td>
                  <button
                    onClick={() => handleViewDetails(bill)}
                    style={{ backgroundColor: "blue", padding: "10px" }}
                  >
                    View More Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
