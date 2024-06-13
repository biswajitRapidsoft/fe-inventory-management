import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getSignup } from "../../actions/loginAction";
import backgroundImage from "../../img/how-to-write-a-business-plan-for-a-mobile-app.jpg";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  let navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userRegDetails = {
      userName: fullName,
      email: email,
      password: password,
    };

    try {
      const response = await getSignup(userRegDetails);
      navigate("/");
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const errorMessage = error.response.data.message;
      setError(errorMessage);
      setOpenSnackbar(true);

      if (
        error.response.status === 403 ||
        error.response.status === 401 ||
        error.response.status === 500
      ) {
        localStorage.removeItem("loginDetails");
        navigate("/");
      }
    } else {
      console.error("Error Adding / Editing Product:", error.message);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Grid item xs={12} sm={8} md={5}>
        <Paper
          elevation={16}
          sx={{
            padding: 4,
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ textDecoration: "underline" }}
          >
            Sign Up
          </Typography>

          <form onSubmit={handleSubmit} style={{ marginBottom: "15px" }}>
            <TextField
              label="Full Name"
              id="fullName"
              name="fullName"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <TextField
              label="Email Address"
              id="userName"
              name="userName"
              variant="outlined"
              type="email"
              required
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              id="password"
              name="password"
              variant="outlined"
              type="password"
              required
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, fontSize: 20 }}
              fullWidth
            >
              Submit
            </Button>
          </form>

          <NavLink style={{ marginTop: "10px" }} to={"/"}>
            Already have an account? Log In
          </NavLink>
        </Paper>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
