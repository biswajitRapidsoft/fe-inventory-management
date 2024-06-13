import { getProducts, createOrder } from "../services/user.service";

const fetchProducts = async (adminId, token) => {
  try {
    const products = await getProducts(adminId, token);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const submitOrder = async (orderDetails, token) => {
  try {
    const response = await createOrder(orderDetails, token);
    console.log("Order successfully created:", response);
    return response;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export { fetchProducts, submitOrder };
