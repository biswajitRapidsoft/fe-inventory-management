import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/logIn/Login";
import SignUp from "./components/logIn/Signup";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      errorElement: <h1>Error 404! Page Not Found!</h1>,
    },

    {
      path: "/signup",
      element: <SignUp />,
      errorElement: <h1>Error 404! Page Not Found!</h1>,
    },

    {
      path: "/dashboard",
      element: <Dashboard />,
      errorElement: <h1>Error 404! Page Not Found!</h1>,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
