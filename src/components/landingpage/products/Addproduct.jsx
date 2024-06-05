import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";
import config from "../../../config/config";

const AddProductForm = () => {
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));
  const location = useLocation();
  const navigate = useNavigate();

  const initialProductState = location.state?.product || {
    productName: "",
    productType: "",
    quantity: "",
    minimumQuantity: "",
    costPrice: "",
    sellingPrice: "",
    productId: "",
    isActive: "",
    productCode: "",
  };

  const [product, setProduct] = useState(initialProductState);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.product) {
      setProduct(location.state.product);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const productData = {
      productId: location.state?.product
        ? location.state.product.productId
        : null,
      adminId: loginuser.adminId,
      productName: product.productName,
      productType: product.productType,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      quantity: product.quantity,
      minimumQuantity: product.minimumQuantity,
      isActive: location.state?.product
        ? location.state.product.isActive
        : true,
    };

    try {
      const apiUrl = `${config.baseUrl}${config.apiEndPoint.addproduct}`;

      const response = await axios.post(apiUrl, productData, {
        headers: {
          Authorization: `Bearer ${loginuser.jwtToken}`,
        },
      });

      console.log("Product added/updated successfully:", response.data);
      navigate("/landingpage/products");
    } catch (error) {
      console.error("Error adding/updating product:", error);
      setError("Failed to add/update product. Please try again.");
    }
  };

  return (
    <Box className="add-product-container">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Product Name"
          name="productName"
          value={product.productName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Product Type"
          name="productType"
          value={product.productType}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={product.quantity}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Minimum Quantity"
          name="minimumQuantity"
          type="number"
          value={product.minimumQuantity}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Box display="flex" gap="10px">
          <TextField
            label="Cost Price"
            name="costPrice"
            type="number"
            value={product.costPrice}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Selling Price"
            name="sellingPrice"
            type="number"
            value={product.sellingPrice}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Box>
        {error && <Box color="red">{error}</Box>}
        <Box display="flex" justifyContent="space-between" marginTop="20px">
          <Button type="submit" variant="contained" color="primary">
            {location.state?.product ? "Update Product" : "Add Product"}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/landingpage/products")}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddProductForm;
