import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Typography, Button, Container } from "@mui/material";

export default function MyAccount() {
  const navigate = useNavigate();
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
      }}
    >
      <Avatar
        alt={loginuser.username}
        src="/path/to/your/default/image.jpg" // Change this to the path of your default image
        sx={{ width: 100, height: 100, mb: 2 }}
      />
      <Typography variant="h4" gutterBottom>
        {loginuser.username}
      </Typography>
      <Typography variant="body1" gutterBottom>
        User ID: {loginuser.userId}
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
