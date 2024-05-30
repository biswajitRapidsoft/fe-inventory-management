import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSignup } from "../../action/login";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userRegDetails = {
      fullName: fullName,
      userName: email,
      password: password,
      address: {
        phoneNo: phoneNo,
        houseNo: houseNo,
        street: street,
        city: city,
        landmark: landmark,
        state: state,
        pin: pin,
      },
    };

    try {
      const response = await getSignup(userRegDetails);
    } catch (error) {
      console.log(error);
    }

    navigate("/");
  };

  return (
    <>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ padding: 4 }}>
          <Typography variant="h3" textAlign="center">
            Sign Up
          </Typography>

          <form onSubmit={(e) => handleSubmit(e)}>
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
              label="User Name"
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

            <TextField
              label="Phone Number"
              id="phoneNo"
              name="phoneNo"
              variant="outlined"
              type="number"
              required
              margin="normal"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />

            <TextField
              label="House Number"
              id="houseNo"
              name="houseNo"
              variant="outlined"
              type="number"
              required
              margin="normal"
              sx={{ marginLeft: 1 }}
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
            />

            <TextField
              label="Street"
              id="street"
              name="street"
              variant="outlined"
              required
              margin="normal"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />

            <TextField
              label="City"
              id="city"
              name="city"
              variant="outlined"
              required
              margin="normal"
              sx={{ marginLeft: 1 }}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <TextField
              label="Landmark"
              id="landmark"
              name="landmark"
              variant="outlined"
              margin="normal"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />

            <TextField
              label="State"
              id="state"
              name="state"
              variant="outlined"
              required
              margin="normal"
              sx={{ marginLeft: 1 }}
              value={state}
              onChange={(e) => setState(e.target.value)}
            />

            <TextField
              label="Pin"
              id="pin"
              name="pin"
              variant="outlined"
              type="number"
              required
              margin="normal"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
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
        </Paper>
      </Container>
    </>
  );
}
