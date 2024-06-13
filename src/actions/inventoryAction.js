import {
  fetchAllProducts,
  updateProductStatus,
} from "../services/user.service";

const getAllProducts = async (adminId, jwtToken) => {
  try {
    return await fetchAllProducts(adminId, jwtToken);
  } catch (error) {
    throw error;
  }
};

const toggleProductStatus = async (product, jwtToken) => {
  try {
    return await updateProductStatus(product, jwtToken);
  } catch (error) {
    throw error;
  }
};

export { getAllProducts, toggleProductStatus };
