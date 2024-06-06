// Landingpage.js
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Typography, Button, Container } from "@mui/material";

export default function Landingpage() {
  const navigate = useNavigate();

  const logedinuser = JSON.parse(localStorage.getItem("loginuser"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  if (logedinuser) {
    return (
      <div className="landingpage">
        <div className="landingpage-header">
          <Header />
        </div>
        <div className="landingpage-sidebar">
          <Sidebar />
        </div>
        <div className="landingpage-outlet">
          <Outlet />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1>please login before </h1>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Login
        </Button>{" "}
      </div>
    );
  }
}
