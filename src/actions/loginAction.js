import { fetchLogin, fetchSignup } from "../services/user.service";

export const getLogin = async (loginbody) => {
  try {
    const logindetails = await fetchLogin(loginbody);
    localStorage.setItem("loginDetails", JSON.stringify(logindetails));
    return logindetails;
  } catch (error) {
    throw error.message || "An error occurred during login";
  }
};

export const getSignup = async (signupBody) => {
  try {
    const signupDetails = await fetchSignup(signupBody);
    localStorage.setItem("signupDetails", JSON.stringify(signupDetails));
    return signupDetails;
  } catch (error) {
    throw error.message || "An error occurred during signup";
  }
};
