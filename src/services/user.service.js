import axios from "axios";
import config from "../config/config";

export const fetchLogin = async (loginbody) => {
  try {
    const response = await axios.post(
      `${config.baseUrl}${config.apiEndPoint.login}`,
      loginbody
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchSignup = async (signupbody) => {
  try {
    const response = await axios.post(
      `${config.baseUrl}${config.apiEndPoint.sigup}`,
      signupbody
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
