import { Button, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getSignup } from "../../actions/loginAction";
import img1 from "../../img/customised-data-image.png";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, seterror] = useState("");

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userRegDetails = {
      userName: fullName,
      email: email,
      password: password,
    };

    try {
      await getSignup(userRegDetails);
      navigate("/");
    } catch (error) {
      seterror(error);
      console.log(error);
    }
  };

  return (
    <div className="logincontainer">
      <div className="loginimg">
        <img src={img1} alt="" />
      </div>
      <div className="loginform">
        <Paper elevation={4} sx={{ padding: 4 }}>
          <Typography variant="h4" textAlign="center">
            Sign Up
          </Typography>

          <form
            onSubmit={(e) => handleSubmit(e)}
            style={{ marginBottom: "20px" }}
          >
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
              label="Email"
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
            {error && (
              <p style={{ color: "red" }}>{error.response.data.message}</p>
            )}
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
          <NavLink to={"/"}>Back to login</NavLink>
        </Paper>
      </div>
    </div>
  );
}
