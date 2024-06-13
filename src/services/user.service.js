// Login/ Signup Service
import axios from "axios";
import { baseUrl, apiEndPoint } from "../config/config";

export const fetchLogin = async (loginbody) => {
  try {
    const response = await axios.post(
      `${baseUrl}${apiEndPoint.login}`,
      loginbody
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const fetchSignup = async (signupBody) => {
  try {
    const response = await axios.post(
      `${baseUrl}${apiEndPoint.signup}`,
      signupBody
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

// Order Service
const getOrderHistory = async (
  adminId,
  jwtToken,
  searchQuery,
  selectedDate,
  currentPage,
  pageSize
) => {
  const response = await axios.get(
    `${baseUrl}${apiEndPoint.orderHistoryAll}?adminId=${adminId}&search=${searchQuery}&date=${selectedDate}&page=${currentPage}&size=${pageSize}`,
    {
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    }
  );
  return response.data;
};

export { getOrderHistory };

//Inventory Service
const fetchAllProducts = async (adminId, jwtToken) => {
  try {
    const response = await axios.get(
      `${baseUrl}${apiEndPoint.allProduct}?adminId=${adminId}`,
      {
        headers: {
          Authorization: "Bearer " + jwtToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const updateProductStatus = async (product, jwtToken) => {
  try {
    const response = await axios.post(
      `${baseUrl}${apiEndPoint.addEditProduct}`,
      product,
      {
        headers: {
          Authorization: "Bearer " + jwtToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product status:", error);
    throw error;
  }
};

export { fetchAllProducts, updateProductStatus };

// AddEditProduct Service
const addEditProduct = async (product, jwtToken) => {
  const response = await axios.post(
    `${baseUrl}${apiEndPoint.addEditProduct}`,
    product,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
  return response.data;
};

export { addEditProduct };

// DashBoard Service
export const fetchProducts = async (adminId, jwtToken) => {
  try {
    const response = await axios.get(
      `${baseUrl}${apiEndPoint.allProduct}?adminId=${adminId}`,
      {
        headers: {
          Authorization: "Bearer " + jwtToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchOrderHistory = async (adminId, date, jwtToken) => {
  try {
    const response = await axios.get(
      `${baseUrl}${apiEndPoint.orderHistoryAll}?adminId=${adminId}&date=${date}`,
      {
        headers: {
          Authorization: "Bearer " + jwtToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// CreateOrder Service
const getProducts = async (adminId, token) => {
  const response = await axios.get(
    `${baseUrl}${apiEndPoint.allProduct}?adminId=${adminId}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
};

const createOrder = async (orderDetails, token) => {
  const response = await axios.post(
    `${baseUrl}${apiEndPoint.createOrder}`,
    orderDetails,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
};

export { getProducts, createOrder };
