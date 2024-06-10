import axios from "axios";
import { apiEndPoint, baseUrl } from "../../src/config/config";

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
