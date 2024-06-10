import { fetchLogin, fetchSignup } from "../services/user.service";

export const getLogin = async (loginbody) => {
  try {
    const logindetails = await fetchLogin(loginbody);
    localStorage.setItem("loginDetails", JSON.stringify(logindetails));
    return logindetails;
  } catch (error) {
    let errorMessage = "An error occurred during login";
    if (typeof error === "string") {
      errorMessage = error;
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
      errorMessage = error.response.data.message;
    }
    throw errorMessage;
  }
};
