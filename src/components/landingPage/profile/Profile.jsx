import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import Img from "../../../img/user-image.avif";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const adminDetails = JSON.parse(localStorage.getItem("loginDetails"));
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("loginDetails");
    localStorage.removeItem("cartItems");
    navigate("/");
  };

  return (
    <Grid
      container
      className="profile"
      sx={{
        height: "100%",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        overflow: "auto",
      }}
    >
      <Grid item container className="pic-info" justifyContent="space-between">
        <Grid item className="pf-info" xs={12} md={8}>
          <Grid item className="name" sx={{ marginBottom: "20px" }}>
            <Typography
              variant="h5"
              sx={{ fontSize: "20px", fontWeight: "600" }}
            >
              Name:
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontSize: "20px", fontWeight: "600" }}
            >
              {adminDetails.userName}
            </Typography>
          </Grid>
          <Grid item className="userId" sx={{ marginBottom: "20px" }}>
            <Typography
              variant="h5"
              sx={{ fontSize: "20px", fontWeight: "600" }}
            >
              User ID:
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontSize: "20px", fontWeight: "600" }}
            >
              {adminDetails.adminId}
            </Typography>
          </Grid>
          <Grid item className="email" sx={{ marginBottom: "20px" }}>
            <Typography
              variant="h5"
              sx={{ fontSize: "20px", fontWeight: "600" }}
            >
              Email:
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontSize: "20px", fontWeight: "600" }}
            >
              {adminDetails.email}
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4} className="pic">
          <img
            src={Img}
            alt="Profile"
            style={{ height: "auto", width: "100%", borderRadius: "10px" }}
          />
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{ marginTop: "20px", width: "100%", textAlign: "center" }}
      >
        <Button variant="contained" onClick={handleLogOut}>
          Log Out
        </Button>
      </Grid>
    </Grid>
  );
}
