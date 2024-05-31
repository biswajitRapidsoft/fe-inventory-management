import React from "react";
import logo from "../../img/logo.svg";
import userimg from "../../img/download.png";

export default function Header() {
  return (
    <div className="header">
      <div className="header-logo">
        <p>IMS</p>
        <h3>Inventory Management System</h3>
      </div>
      <div className="header-user">
        <p>Yash Inventory</p>
        <img src={userimg} alt="User" />
      </div>
    </div>
  );
}
