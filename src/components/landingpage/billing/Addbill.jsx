import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import config from "../../../config/config";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
const AddBill = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [description, setDescription] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [date, setDate] = useState("");
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
    const fetchProductOptions = async () => {
      try {
        const response = await axios.get(
          `${config.baseUrl}${config.apiEndPoint.allproduct}?adminId=${loginuser.adminId}`,
          {
            headers: {
              Authorization: `Bearer ${loginuser.jwtToken}`,
            },
          }
        );
        const availableProducts = response.data
          .filter((product) => product.isActive)
          .map((product) => ({
            productId: product.productId,
            productName: product.productName,
            productType: product.productType,
            minimumQuantity: product.minimumQuantity,
            quantity: product.quantity,
            sellingPrice: product.sellingPrice,
            productCode: product.productCode,
            isActive: product.isActive,
          }));

        setProductOptions(availableProducts);
        console.log(response);
      } catch (error) {
        handleTokenError(error);
        console.error("Failed to fetch product options", error);
      }
    };

    fetchProductOptions();
  }, [loginuser.adminId, loginuser.jwtToken]);

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        productId: "",
        productName: "",
        quantity: 0,
        sellingPrice: 0,
        maxQuantity: 0,
        productCode: "",
        totalPrice: 0,
      },
    ]);
  };

  const handleProductChange = (index, newValue) => {
    const selectedProduct = productOptions.find(
      (product) => product.productId === newValue?.productId
    );

    if (
      selectedProduct &&
      products.some(
        (product) => product.productId === selectedProduct.productId
      )
    ) {
      alert("This product is already added.");
      return;
    }

    const newProducts = [...products];
    if (selectedProduct) {
      newProducts[index] = {
        productId: selectedProduct.productId,
        productName: selectedProduct.productName,
        quantity: 0,
        sellingPrice: selectedProduct.sellingPrice,
        maxQuantity: selectedProduct.quantity,
        productCode: selectedProduct.productCode,
        totalPrice: 0,
      };
    }
    setProducts(newProducts);
    updateTotalAmount(newProducts);
  };

  const handleProductQuantityChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].quantity = Math.min(
      Number(value),
      newProducts[index].maxQuantity
    );
    newProducts[index].totalPrice =
      Math.min(Number(value), newProducts[index].maxQuantity) *
      newProducts[index].sellingPrice;

    setProducts(newProducts);
    updateTotalAmount(newProducts);
  };

  const handleRemoveProduct = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
    updateTotalAmount(newProducts);
  };

  const updateTotalAmount = (products) => {
    const total = products.reduce((sum, product) => {
      return sum + product.quantity * product.sellingPrice;
    }, 0);
    setTotalAmount(total);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !customerName ||
      !customerNumber ||
      !description ||
      products.length === 0
    ) {
      alert("Please  add at least one product.");
      return;
    }

    for (const product of products) {
      if (!product.productId || !product.productName) {
        alert("Please ensure all added products are selected.");
        return;
      }
      if (product.quantity === 0) {
        alert("Please ensure quantity is greater than zero for all products.");
        return;
      }
    }

    const items = products.map((product) => ({
      productId: product.productId,
      sellingPrice: product.sellingPrice,
      productCode: product.productCode,
      quantity: product.quantity,
      productName: product.productName,
      totalPrice: product.totalPrice,
    }));

    const order = {
      adminId: loginuser.adminId,
      customerName,
      description,
      phoneNo: customerNumber,
      products: items,
      totalAmount,
    };

    try {
      const response = await axios.post(
        `${config.baseUrl}${config.apiEndPoint.addbill}`,
        order,
        {
          headers: {
            Authorization: `Bearer ${loginuser.jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/landingpage/billing");
      console.log(response);
    } catch (error) {
      handleTokenError(error);
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/landingpage/billing");
  };

  const handleChange = (newValue) => {
    setCustomerNumber(newValue);
  };
  const handleTokenError = (error) => {
    if (
      (error.response && error.response.status === 403) ||
      (error.response && error.response.status === 401)
    ) {
      localStorage.removeItem("loginuser");
      navigate("/landingpage", {
        state: {
          errorMessage: "Invalid session, please login again",
        },
      });
    } else {
      console.error("Error:", error);
    }
  };
  return (
    <Container>
      <Box
        component="form"
        onSubmit={handleSave}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 600,
          margin: "auto",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Total Amount: Rs {totalAmount}</Typography>
          <Typography variant="h5">Date: {date}</Typography>
        </Box>

        <TextField
          required
          label="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          fullWidth
        />

        <MuiTelInput
          required
          value={customerNumber}
          onChange={handleChange}
          fullWidth
          label="Phone Number"
          inputProps={{ maxLength: 15 }}
        />

        <TextField
          required
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Products:</Typography>
          <Button variant="contained" onClick={handleAddProduct}>
            + Add Product
          </Button>
        </Box>

        {products.map((product, index) => (
          <Grid container spacing={2} key={index} alignItems="center">
            <Grid item xs={6}>
              <Autocomplete
                value={
                  productOptions.find(
                    (option) => option.productId === product.productId
                  ) || null
                }
                onChange={(event, newValue) =>
                  handleProductChange(index, newValue)
                }
                options={productOptions}
                getOptionLabel={(option) => option.productName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Product"
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="number"
                label="Quantity"
                value={product.quantity}
                inputProps={{ min: 0, max: product.maxQuantity }}
                onChange={(e) =>
                  handleProductQuantityChange(index, e.target.value)
                }
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <Typography>₹{product.totalPrice}</Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={() => handleRemoveProduct(index)}>
                <DeleteForeverIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Box display="flex" justifyContent="space-between" gap={2}>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddBill;
