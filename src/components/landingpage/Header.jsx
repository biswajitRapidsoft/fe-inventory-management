import React from "react";
import logo from "../../img/logo.svg";
import userimg from "../../img/download.png";

export default function Header() {
  const logedinuser = JSON.parse(localStorage.getItem("loginuser"));
  return (
    <div className="header">
      <div className="header-logo">
        <p>IMS</p>
        <h3>Inventory Management System</h3>
      </div>
      <div className="header-user">
        <p>{logedinuser.userName}</p>
        <img src={userimg} alt="User" />
      </div>
    </div>
  );
}
