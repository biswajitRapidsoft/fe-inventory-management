import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Snackbar,
} from "@mui/material";
import { Alert } from "@mui/material";
import { getLogin } from "../../actions/loginAction";
import { NavLink, useNavigate } from "react-router-dom";
import backgroundImage from "../../img/how-to-write-a-business-plan-for-a-mobile-app.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleError = (error) => {
    setError(error);
    setOpenSnackbar(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginbody = {
      email: email,
      password: password,
    };

    try {
      const fetchedlogin = await getLogin(loginbody);
      navigate("/landingpage/dashboard");
    } catch (error) {
      handleError(error);
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
            sx={{ textDecoration: "underline" }}
            textAlign="center"
          >
            Login
          </Typography>
          <form onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              type="email"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </form>
          <NavLink style={{ marginTop: "10px" }} to={"/signup"}>
            Don't have an account? Sign Up
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
};

export default Login;
