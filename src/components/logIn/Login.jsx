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
import { NavLink, useNavigate } from "react-router-dom";
import { getLogin } from "../../actions/loginAction";
import img1 from "../../img/customised-data-image.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidlogindetails, setinvalidlogindetails] = useState(false);

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
    navigate("/landingpage/dashboard");

    // try {
    //   const fetchedlogin = await getLogin(loginbody);
    //   setEmail("");
    //   setPassword("");
    // } catch (error) {
    //   console.error("Error while login:", error);
    // }
  };

  return (
    <div className="logincontainer">
      <div className="loginimg">
        <img src={img1} alt="" />
      </div>
      <div className="loginform">
        <Paper elevation={5} sx={{ padding: 4 }}>
          <Typography variant="h4" textAlign="center">
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
            {invalidlogindetails && <p>enter valid login cridentials</p>}

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
          <NavLink to={"/signup"} style={{ fontSize: "14px" }}>
            Don't have an account? Sign Up
          </NavLink>
        </Paper>
      </div>
    </div>
  );
};

export default Login;
