import { fetchLogin, fetchSignup } from "../services/user.service";

export const getLogin = async (loginbody) => {
  try {
    const logindetails = await fetchLogin(loginbody);
    console.log(logindetails);
    localStorage.setItem("loginuser", JSON.stringify(logindetails));

    return logindetails;
  } catch (error) {
    console.error("Error while login", error);
    throw error;
  }
};
export const getSignup = async (signupbody) => {
  try {
    const signupdetails = await fetchSignup(signupbody);
    return signupdetails;
  } catch (error) {
    console.error("Error while sign up:", error);
    throw error;
  }
};
