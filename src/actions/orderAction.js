import { getOrderHistory } from "../services/user.service";

const fetchOrders = async (
  adminDetails,
  searchQuery,
  selectedDate,
  currentPage,
  pageSize
) => {
  try {
    const orders = await getOrderHistory(
      adminDetails.adminId,
      adminDetails.jwtToken,
      searchQuery,
      selectedDate,
      currentPage,
      pageSize
    );
    return orders;
  } catch (error) {
    throw error;
  }
};

export { fetchOrders };
