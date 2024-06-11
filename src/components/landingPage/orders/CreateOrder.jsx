import { Grid, TextField, Typography, Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import { fetchProducts, submitOrder } from "../../../actions/createOrderAction";
import { MuiTelInput } from "mui-tel-input";

export default function CreateOrder() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhoneNo, setCustomerPhoneNo] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState([]);
  const adminDetails = JSON.parse(localStorage.getItem("loginDetails"));

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await fetchProducts(
          adminDetails.adminId,
          adminDetails.jwtToken
        );
        setProducts(productsData);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadProducts();
  }, [adminDetails.adminId, adminDetails.jwtToken]);

  const activeProducts = products.filter((product) => product.isActive);

  const handleQuantityChange = (productCode, quantity) => {
    const parsedQuantity = parseInt(quantity, 10);

    if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
      setAddedProducts((prev) =>
        prev.map((product) =>
          product.productCode === productCode
            ? {
                ...product,
                purchaseQuantity: parsedQuantity,
                totalPrice: product.sellingPrice * parsedQuantity,
              }
            : product
        )
      );
    }
  };

  const handleRemoveProduct = (productCode) => {
    setAddedProducts((prev) =>
      prev.filter((product) => product.productCode !== productCode)
    );
  };

  const handleProductSelect = (event, value) => {
    if (value) {
      const selectedProduct = products.find(
        (product) => product.productCode === value.productCode
      );

      if (selectedProduct) {
        const isAlreadyAdded = addedProducts.some(
          (product) => product.productCode === selectedProduct.productCode
        );

        if (!isAlreadyAdded) {
          setAddedProducts((prev) => [
            ...prev,
            {
              ...selectedProduct,
              purchaseQuantity: 1,
              totalPrice: selectedProduct.sellingPrice,
            },
          ]);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderDetails = {
      adminId: adminDetails.adminId,
      customerName,
      phoneNo: customerPhoneNo,
      description,
      totalAmount: totalCartPrice,
      products: addedProducts.map((product) => ({
        productId: product.productId,
        productCode: product.productCode,
        productName: product.productName,
        quantity: product.purchaseQuantity,
        sellingPrice: product.sellingPrice,
        totalPrice: product.totalPrice,
      })),
    };

    try {
      await submitOrder(orderDetails, adminDetails.jwtToken);
      setCustomerName("");
      setCustomerPhoneNo("");
      setDescription("");
      setAddedProducts([]);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const totalCartPrice = addedProducts.reduce(
    (total, product) => total + (product.totalPrice || 0),
    0
  );

  return (
    <Grid
      container
      className="create-order-container"
      gap={1}
      sx={{ height: "100%" }}
    >
      <Grid
        item
        xs={12}
        className="create-order-form"
        sx={{ height: "fit-content" }}
      >
        <Typography
          variant="h5"
          sx={{ textDecoration: "underline", marginBottom: "10px" }}
          textAlign="center"
        >
          Check Out Form
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} className="checkout-customer-form">
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={activeProducts}
                getOptionLabel={(option) => option.productName}
                onChange={handleProductSelect}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Product" />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                sx={{ bgcolor: "white" }}
                label="Customer's Name"
                id="customerName"
                name="customerName"
                variant="outlined"
                type="text"
                required
                fullWidth
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </Grid>

            <Grid item xs={4}>
              <MuiTelInput
                required
                fullWidth
                inputProps={{
                  maxLength: 15,
                }}
                value={customerPhoneNo}
                onChange={(e) => setCustomerPhoneNo(e)}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                sx={{ bgcolor: "white" }}
                label="Description"
                id="description"
                name="description"
                variant="outlined"
                type="text"
                inputProps={{ maxLength: 100 }}
                required
                fullWidth
                value={description}
                onChange={(e) => {
                  const trimmedValue = e.target.value.trimStart();
                  setDescription(trimmedValue);
                }}
              />
            </Grid>
          </Grid>

          <TableContainer
            component={Paper}
            className="cart-table"
            sx={{ marginTop: "15px" }}
          >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Product Code</TableCell>
                  <TableCell align="right">Product Name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Total Price</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              {addedProducts.length > 0 && (
                <>
                  <TableBody>
                    {addedProducts.map((product) => (
                      <TableRow
                        key={product.productCode}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {product.productCode}
                        </TableCell>
                        <TableCell align="right">
                          {product.productName}
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            value={product.purchaseQuantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                product.productCode,
                                e.target.value
                              )
                            }
                            inputProps={{
                              min: 1,
                              max: product.quantity,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {product.totalPrice}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="dark"
                            onClick={() =>
                              handleRemoveProduct(product.productCode)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="h6">Total Price:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">{totalCartPrice}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </>
              )}
            </Table>
          </TableContainer>

          <Grid
            item
            xs={12}
            className="checkout-customer-form"
            sx={{ height: "fit-content", marginTop: "15px" }}
          >
            <Button variant="contained" color="primary" type="submit">
              Check Out
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
