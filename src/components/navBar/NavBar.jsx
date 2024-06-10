import React from "react";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Img from "../../img/user-image.avif";

export default function NavBar({ adminDetails }) {
  return (
    <>
      <div className="navbar">
        <div className="user-name">
          <img src={Img} alt="" />
          <h1>{adminDetails?.userName}</h1>
        </div>
        <div className="logo-name">
          <Inventory2OutlinedIcon sx={{ fontSize: 50 }} />
          <h1>Inventory Management</h1>
        </div>
      </div>
    </>
  );
}
