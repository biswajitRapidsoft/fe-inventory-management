import { fetchallproducts } from "../services/user.service";
import { addnewproduct } from "../services/user.service";
import config from "../config/config";
const storedLoginUser = localStorage.getItem("loginuser");
const loginuser = storedLoginUser ? JSON.parse(storedLoginUser) : null;
console.log(loginuser, "loginuserrrrr");

const header = {
  headers: {
    Authorization: `Bearer ${loginuser?.jwtToken}`,
  },
};

export const getallproduct = async () => {
  try {
    const url = `${config.baseUrl}${config.apiEndPoint.allproduct}?adminId=${loginuser?.adminId}`;

    const response = await fetchallproducts(url, header);

    return response;
  } catch (error) {
    console.error("Error while login", error);
    throw error;
  }
};
export const addproduct = async (payload) => {
  try {
    const url = `${config.baseUrl}${config.apiEndPoint.addproduct}`;

    const allproduct = await addnewproduct(url, payload, header);

    return allproduct;
  } catch (error) {
    console.error("Error while login", error);
    throw error;
  }
};
