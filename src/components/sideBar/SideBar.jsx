import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptIcon from "@mui/icons-material/Receipt";

export default function SideBar({ activeButton, handleNavigation }) {
  return (
    <div className="sidebar">
      <div
        className={`dashboard-btn ${
          activeButton === "dashboard" ? "active" : ""
        }`}
        onClick={() => handleNavigation("/landingpage/dashboard", "dashboard")}
      >
        <SpaceDashboardIcon className="icon" />
        <p>DashBoard</p>
      </div>

      <div
        className={`dashboard-btn ${
          activeButton === "inventory" ? "active" : ""
        }`}
        onClick={() => handleNavigation("/landingpage/inventory", "inventory")}
      >
        <Inventory2Icon className="icon" />
        <p>Inventory</p>
      </div>

      <div
        className={`order-history-btn ${
          activeButton === "orderhistory" ? "active" : ""
        }`}
        onClick={() =>
          handleNavigation("/landingpage/orderhistory", "orderhistory")
        }
      >
        <ReceiptIcon className="icon" />
        <p>Orders</p>
      </div>

      <div
        className={`profile-btn ${activeButton === "profile" ? "active" : ""}`}
        onClick={() => handleNavigation("/landingpage/profile", "profile")}
      >
        <AccountCircleIcon className="icon" />
        <p>My Profile</p>
      </div>
    </div>
  );
}
