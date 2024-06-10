import axios from "axios";
import { apiEndPoint, baseUrl } from "../../src/config/config";

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
