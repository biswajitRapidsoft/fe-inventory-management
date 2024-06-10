import axios from "axios";
import { apiEndPoint, baseUrl } from "../../src/config/config";

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
