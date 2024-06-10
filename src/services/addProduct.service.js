import axios from "axios";
import { apiEndPoint, baseUrl } from "../../src/config/config";

const addEditProduct = async (product, jwtToken) => {
  const response = await axios.post(
    `${baseUrl}${apiEndPoint.addEditProduct}`,
    product,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
  return response.data;
};

export { addEditProduct };
