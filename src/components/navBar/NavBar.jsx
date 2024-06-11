import React from "react";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useMediaQuery } from "@mui/material";

export default function NavBar({ adminDetails }) {
  const isLargeScreen = useMediaQuery("(min-width:900px)");

  return (
    <div className="navbar">
      <div className="user-name">
        <h1>{adminDetails?.userName}</h1>
      </div>
      <div className="logo-name">
        <Inventory2OutlinedIcon sx={{ fontSize: { xs: 30, sm: 40, md: 50 } }} />
        <h1>{isLargeScreen ? "Inventory Management" : "IMS"}</h1>
      </div>
    </div>
  );
}
