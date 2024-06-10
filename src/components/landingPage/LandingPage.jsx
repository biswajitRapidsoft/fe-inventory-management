import React, { useState, useEffect } from "react";
import NavBar from "../navBar/NavBar";
import SideBar from "../sideBar/SideBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function LandingPage() {
  const adminDetails = JSON.parse(localStorage.getItem("loginDetails"));
  const navigate = useNavigate();
  const location = useLocation();

  const [activeButton, setActiveButton] = useState("");

  useEffect(() => {
    switch (location.pathname) {
      case "/landingpage/dashboard":
        setActiveButton("dashboard");
        break;
      case "/landingpage/profile":
        setActiveButton("profile");
        break;
      case "/landingpage/inventory":
        setActiveButton("inventory");
        break;
      case "/landingpage/orderhistory":
        setActiveButton("orderhistory");
        break;
      default:
        setActiveButton("");
    }
  }, [location.pathname]);

  const handleNavigation = (path, buttonName) => {
    setActiveButton(buttonName);
    navigate(path);
  };

  return (
    <>
      <NavBar adminDetails={adminDetails} />
      <div className="landingpage-body">
        <SideBar
          activeButton={activeButton}
          handleNavigation={handleNavigation}
        />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
