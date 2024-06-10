import { addEditProduct } from "../services/addProduct.service";

const saveProduct = async (product, adminDetails) => {
  try {
    const response = await addEditProduct(product, adminDetails.jwtToken);
    return response;
  } catch (error) {
    throw error;
  }
};

export { saveProduct };
