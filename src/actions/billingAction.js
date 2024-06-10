import { fetchallbill } from "../services/user.service";
import { addnewbill } from "../services/user.service";
import config from "../config/config";
const storedLoginUser = localStorage.getItem("loginuser");
const loginuser = storedLoginUser ? JSON.parse(storedLoginUser) : null;

console.log(loginuser);
const header = {
  headers: {
    Authorization: `Bearer ${loginuser?.jwtToken}`,
  },
};
export const getallbill = async (searchQuery, page, rowsPerPage, date) => {
  try {
    const url = `${config.baseUrl}${config.apiEndPoint.allbill}?adminId=${loginuser?.adminId}&search=${searchQuery}&page=${page}&size=${rowsPerPage}&date=${date}`;

    const allbills = await fetchallbill(url, header);
    return allbills;
  } catch (error) {
    console.error("Error while login", error);
    throw error;
  }
};

export const addbill = async (payload) => {
  try {
    const url = `${config.baseUrl}${config.apiEndPoint.addbill}`;
    const response = await addnewbill(url, payload, header);
    return response;
  } catch (error) {
    console.error("Error while login", error);
    throw error;
  }
};
