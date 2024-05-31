import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

export default function Billing() {
  const navigate = useNavigate();

  const handleaddbill = () => {
    navigate("/landingpage/billing/app-bill");
  };
  return (
    <div className="billing-page">
      <div className="product-functionality">
        <div className="product-search">
          <input type="text" placeholder="Search bill..." />
          <SearchIcon sx={{ fontSize: 40 }} className="search-icon" />
        </div>

        <div className="product-add">
          <button onClick={handleaddbill}>+ Add Bill</button>
        </div>
      </div>

      <div className="previous-billings">
        <h1>previous bills</h1>
      </div>
    </div>
  );
}
