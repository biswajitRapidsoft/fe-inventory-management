// Landingpage.js
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Landingpage() {
  return (
    <div className="landingpage">
      <div className="landingpage-header">
        <Header />
      </div>
      <div className="landingpage-sidebar">
        <Sidebar />
      </div>
      <div className="landingpage-outlet">
        <Outlet />
      </div>
    </div>
  );
}
