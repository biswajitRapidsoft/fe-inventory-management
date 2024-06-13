import {
  Alert,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveProduct } from "../../../actions/addProductAction";

export default function AddEditProduct() {
  const location = useLocation();
  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const adminDetails = JSON.parse(localStorage.getItem("loginDetails"));
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.product) {
      const {
        productId,
        productName,
        productType,
        costPrice,
        sellingPrice,
        quantity,
        minimumQuantity,
        isActive,
      } = location.state.product;
      setProductId(productId);
      setProductName(productName);
      setProductCategory(productType);
      setCostPrice(costPrice);
      setSellingPrice(sellingPrice);
      setProductQuantity(quantity);
      setMinQuantity(minimumQuantity);
      setIsActive(isActive);
    }
  }, [location.state]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCancel = () => {
    navigate("/landingpage/inventory");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newProduct = {
      productId: productId,
      adminId: adminDetails.adminId,
      productName: productName,
      productType: productCategory,
      costPrice: costPrice,
      sellingPrice: sellingPrice,
      quantity: productQuantity,
      minimumQuantity: minQuantity,
      isActive: isActive,
    };

    try {
      const response = await saveProduct(newProduct, adminDetails);
      console.log("Product modified successfully:", response);

      setProductId(null);
      setProductName("");
      setProductCategory("");
      setCostPrice("");
      setSellingPrice("");
      setProductQuantity("");
      setMinQuantity("");
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const errorMessage = error.response.data.message;
      setError(errorMessage);
      setOpenSnackbar(true);

      if (
        error.response.status === 403 ||
        error.response.status === 401 ||
        error.response.status === 500
      ) {
        localStorage.removeItem("loginDetails");
        navigate("/");
      }
    } else {
      console.error("Error Adding / Editing Product:", error.message);
    }
  };

  return (
    <Grid
      container
      sx={{
        bgcolor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        height: "100%",
        overflow: "auto",
      }}
    >
      <form onSubmit={(e) => handleSubmit(e)}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              textAlign="center"
              sx={{ textDecoration: "underline" }}
            >
              {location.state && location.state.product
                ? "Edit Product"
                : "Add Product"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} sx={{ height: "fit-content" }}>
            <TextField
              label="Product Name"
              id="productName"
              name="productName"
              variant="outlined"
              type="text"
              required
              fullWidth
              margin="none"
              value={productName}
              onChange={(e) => setProductName(e.target.value.trimStart())}
            />
          </Grid>

          <Grid item xs={12} md={6} sx={{ height: "fit-content" }}>
            <TextField
              label="Product Category"
              id="productCategory"
              name="productCategory"
              variant="outlined"
              type="text"
              required
              fullWidth
              margin="none"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value.trimStart())}
            />
          </Grid>

          <Grid item xs={12} md={6} sx={{ height: "fit-content" }}>
            <TextField
              label="Cost Price"
              id="costPrice"
              name="costPrice"
              variant="outlined"
              type="number"
              required
              fullWidth
              margin="none"
              value={costPrice}
              onChange={(e) => setCostPrice(Math.max(0, e.target.value))}
            />
          </Grid>

          <Grid item xs={12} md={6} sx={{ height: "fit-content" }}>
            <TextField
              label="Selling Price"
              id="sellingPrice"
              name="sellingPrice"
              variant="outlined"
              type="number"
              required
              fullWidth
              margin="none"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Math.max(0, e.target.value))}
            />
          </Grid>

          <Grid item xs={12} md={6} sx={{ height: "fit-content" }}>
            <TextField
              label="Product Quantity"
              id="productQuantity"
              name="productQuantity"
              variant="outlined"
              type="number"
              required
              fullWidth
              margin="none"
              value={productQuantity}
              onChange={(e) => setProductQuantity(Math.max(0, e.target.value))}
            />
          </Grid>

          <Grid item xs={12} md={6} sx={{ height: "fit-content" }}>
            <TextField
              label="Minimum Quantity"
              id="minQuantity"
              name="minQuantity"
              variant="outlined"
              type="number"
              required
              fullWidth
              margin="none"
              value={minQuantity}
              onChange={(e) => setMinQuantity(Math.max(0, e.target.value))}
            />
          </Grid>

          <Grid item container xs={12} spacing={1}>
            <Grid item xs={6} sx={{ textAlign: "end" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ fontSize: 20 }}
              >
                Submit
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                sx={{ fontSize: 20 }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
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
    </Grid>
  );
}
