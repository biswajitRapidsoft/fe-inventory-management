import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Typography, Button, Container } from "@mui/material";
import img1 from "../../../img/download.png";
export default function MyAccount() {
  const navigate = useNavigate();
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Container
      style={{ height: "calc(100vh - 70px)" }}
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
      }}
    >
      <Avatar
        alt={loginuser.username}
        src={img1}
        sx={{ width: 100, height: 100, mb: 2 }}
      />
      <Typography variant="h4" gutterBottom>
        {loginuser.userName}
      </Typography>
      <Typography variant="body1" gutterBottom>
        User ID: {loginuser.adminId}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Email: {loginuser.email}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Container>
  );
}
