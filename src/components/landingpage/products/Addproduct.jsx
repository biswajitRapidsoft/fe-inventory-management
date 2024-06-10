import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";

import { Snackbar, Alert } from "@mui/material";
import { addproduct, getallproduct } from "../../../actions/productAction";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

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
      const response = await addproduct(productData);

      navigate("/landingpage/products");
    } catch (error) {
      handleTokenError(error);

      console.error("Error adding/updating product:", error);
    }
  };
  const handleTokenError = (error) => {
    if (error.response) {
      if (error.response.data.message) {
        const errorMessage = error.response.data.message;
        setError(errorMessage);
        setOpenSnackbar(true);
      }

      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("loginuser");
        navigate("/landingpage", {
          state: {
            errorMessage: "Invalid session, please login again",
          },
        });
      }
    } else {
      console.error("Error fetching order history:", error.message);
    }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box className="add-product-container">
      <form onSubmit={handleSubmit}>
        <TextField
          required
          label="Product Name"
          name="productName"
          value={product.productName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          required
          label="Product Type"
          name="productType"
          value={product.productType}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          required
          label="Quantity"
          name="quantity"
          type="number"
          inputProps={{ min: 0 }}
          value={product.quantity}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          required
          label="Minimum Quantity"
          name="minimumQuantity"
          type="number"
          inputProps={{ min: 0 }}
          value={product.minimumQuantity}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Box display="flex" gap="10px">
          <TextField
            required
            label="Cost Price"
            name="costPrice"
            type="number"
            inputProps={{ min: 0 }}
            value={product.costPrice}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            required
            label="Selling Price"
            name="sellingPrice"
            type="number"
            inputProps={{ min: product.costPrice }}
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddProductForm;
