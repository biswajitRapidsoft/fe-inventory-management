import React from "react";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function Error() {
  let navigate = useNavigate();

  const errorToLogIn = () => {
    navigate("/");
  };
  return (
    <>
      <div className="error">
        <h1 className="err-code-logo">
          <ErrorOutlineOutlinedIcon sx={{ fontSize: 60 }} />
          Error 404!
        </h1>

        <h1>Page Not Found!</h1>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={errorToLogIn}
        >
          Back To Log In
        </Button>
      </div>
    </>
  );
}
