// src/LoginPage.js
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { getLogin } from "../../actions/loginAction";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginbody = {
      username: email,
      password: password,
    };
    try {
      const fetchedlogin = await getLogin(loginbody);
    } catch (error) {
      console.error("Error while login:", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper aliv sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" textAlign="center">
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
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </form>
        <NavLink to={"/signup"}>signup</NavLink>
      </Paper>
    </Container>
  );
};

export default Login;
