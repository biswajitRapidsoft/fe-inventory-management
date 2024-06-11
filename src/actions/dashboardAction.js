import {
  fetchProducts,
  fetchOrderHistory,
} from "../services/dashboard.service";

export const getProducts = async (
  adminDetails,
  setProducts,
  prepareProductQuantityData,
  handleError
) => {
  try {
    const products = await fetchProducts(
      adminDetails.adminId,
      adminDetails.jwtToken
    );
    setProducts(products);
    prepareProductQuantityData(products);
  } catch (error) {
    handleError(error);
  }
};

export const getOrderHistory = async (
  adminDetails,
  selectedDate,
  setOrders,
  handleError
) => {
  try {
    const orders = await fetchOrderHistory(
      adminDetails.adminId,
      selectedDate,
      adminDetails.jwtToken
    );
    setOrders(orders);
  } catch (error) {
    handleError(error);
  }
};
