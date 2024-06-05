import { fetchallproducts } from "../services/user.service";

export const getallproduct = async () => {
  try {
    const allproduct = await fetchallproducts();

    return allproduct;
  } catch (error) {
    console.error("Error while login", error);
    throw error;
  }
};
