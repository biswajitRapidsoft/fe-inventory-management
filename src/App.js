import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/logIn/Login";
import Error from "./components/errorPage/Error";
import Inventory from "./components/landingPage/inventory/Inventory";
import Profile from "./components/landingPage/profile/Profile";
import LandingPage from "./components/landingPage/LandingPage";
import DashBoard from "./components/landingPage/dashBoard/DashBoard";
import AddEditProduct from "./components/landingPage/inventory/AddEditProduct";
import CreateOrder from "./components/landingPage/orders/CreateOrder";
import Orders from "./components/landingPage/orders/Orders";
import { useState } from "react";
import OrderDetails from "./components/landingPage/orders/OrderDetails";
import Signup from "./components/logIn/Signup";

function App() {
  const [emergencyList, setEmergencyList] = useState([]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      errorElement: <Error />,
    },

    {
      path: "/signup",
      element: <Signup />,
      errorElement: <Error />,
    },

    {
      path: "/landingpage",
      element: <LandingPage />,
      children: [
        {
          path: "/landingpage/dashboard",
          element: <DashBoard />,
          errorElement: <Error />,
        },

        {
          path: "/landingpage/profile",
          element: <Profile />,
          errorElement: <Error />,
        },

        {
          path: "/landingpage/inventory",
          element: <Inventory />,
          errorElement: <Error />,
        },

        {
          path: "/landingpage/inventory/addeditproduct",
          element: <AddEditProduct />,
          errorElement: <Error />,
        },

        {
          path: "/landingpage/createorder",
          element: <CreateOrder />,
          errorElement: <Error />,
        },

        {
          path: "/landingpage/orderhistory",
          element: <Orders />,
          errorElement: <Error />,
        },

        {
          path: "/landingpage/orderhistory/orderdetails",
          element: <OrderDetails />,
          errorElement: <Error />,
        },
      ],
      errorElement: <Error />,
    },

    {
      path: "*",
      element: <Error />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
