import axios from "axios";
import { baseUrl, apiEndPoint } from "../config/config";

export const fetchLogin = async (loginbody) => {
  try {
    const response = await axios.post(
      `${baseUrl}${apiEndPoint.login}`,
      loginbody
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw error.response.data.message;
    } else {
      throw error;
    }
  }
};

export const fetchSignup = async (signupBody) => {
  try {
    const response = await axios.post(
      `${baseUrl}${apiEndPoint.signup}`,
      signupBody
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw error.response.data.message;
    } else {
      throw error;
    }
  }
};
