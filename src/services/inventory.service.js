import axios from "axios";
import { apiEndPoint, baseUrl } from "../config/config";

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
