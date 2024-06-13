import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  getAllProducts,
  toggleProductStatus,
} from "../../../actions/inventoryAction";

export default function Inventory() {
  const adminDetails = JSON.parse(localStorage.getItem("loginDetails"));
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsData = await getAllProducts(
        adminDetails.adminId,
        adminDetails.jwtToken
      );
      setProducts(productsData);
    } catch (error) {
      handleError(error, "fetching products");
    }
  };

  const handleError = (error, type) => {
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
      console.error(`Error ${type}:`, error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleActiveChange = (event) => {
    setActiveStatusFilter(event.target.value);
  };

  const toggleStatus = async (id) => {
    try {
      const product = products.find((product) => product.productId === id);
      if (product) {
        const newStatus = !product.isActive;
        const updatedProduct = await toggleProductStatus(
          { ...product, isActive: newStatus },
          adminDetails.jwtToken
        );
        if (updatedProduct) {
          const updatedProducts = products.map((product) =>
            product.productId === id
              ? { ...product, isActive: newStatus }
              : product
          );
          setProducts(updatedProducts);
        }
      }
    } catch (error) {
      handleError(error, "toggling product status");
    }
  };

  const filteredProducts = products?.filter((product) => {
    const nameMatch = product.productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const codeMatch = product.productCode.toString().includes(searchQuery);
    const isActive =
      activeStatusFilter === "all" ||
      (activeStatusFilter === "active" && product.isActive) ||
      (activeStatusFilter === "inactive" && !product.isActive);
    const isLowStock =
      (activeStatusFilter === "lowstock" &&
        product.quantity < product.minimumQuantity) ||
      product.quantity === 0;
    const isOutOfStock =
      activeStatusFilter === "outofstock" && product.quantity === 0;

    return (nameMatch || codeMatch) && (isActive || isLowStock || isOutOfStock);
  });

  const addProduct = () => {
    navigate("/landingpage/inventory/addeditproduct");
  };

  const editProduct = (product) => {
    navigate("/landingpage/inventory/addeditproduct", { state: { product } });
  };

  return (
    <Grid
      container
      sx={{ bgcolor: "#fff", borderRadius: "10px", padding: "10px" }}
    >
      <Grid item container xs={12} sx={{ height: "fit-content" }}>
        <Grid
          item
          xs={12}
          sm={6}
          className="search-addbtn"
          sx={{
            padding: "10px",
            bgcolor: "#c5dff8",
            height: "fit-content",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        >
          <input
            className="search-inp"
            type="text"
            placeholder="Search by name"
            value={searchQuery.trim()}
            onChange={handleSearchChange}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#0d6efd",
              color: "#fff",
              border: "none",
              padding: "8px 20px",
              borderRadius: "6px",
            }}
            disabled={!searchQuery || searchQuery.trim() === ""}
          >
            Search
          </Button>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          container
          sx={{
            justifyContent: "end",
            height: "fit-content",
            marginBottom: "10px",
          }}
          spacing={1}
        >
          <Grid item xs={6} md={4} className="inventory-filter">
            <FormControl
              sx={{ width: "100%", bgcolor: "#fff", borderRadius: "10px" }}
            >
              <InputLabel id="active-status-label">Active Status</InputLabel>
              <Select
                labelId="active-status-label"
                id="active-status"
                value={activeStatusFilter}
                onChange={handleActiveChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="lowstock">Low Stock</MenuItem>
                <MenuItem value="outofstock">Out Of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={4} className="add-btn-grid">
            <Button
              className="add-btn"
              onClick={addProduct}
              variant="contained"
              color="primary"
              sx={{ margin: 0, padding: "15px 20px", width: "100%" }}
            >
              + Add
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ height: "fit-content" }}>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>
                  <h3>Code</h3>
                </th>
                <th>
                  <h3>Product Name</h3>
                </th>
                <th>
                  <h3>Cost Price</h3>
                </th>
                <th>
                  <h3>Selling Price</h3>
                </th>
                <th>
                  <h3>Quantity</h3>
                </th>
                <th>
                  <h3>Min Quantity</h3>
                </th>
                <th>
                  <h3>Edit</h3>
                </th>
                <th>
                  <h3>Status</h3>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.productId}>
                  <td
                    style={{
                      color:
                        product.quantity < product.minimumQuantity ||
                        product.quantity === 0
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {product.productCode}
                  </td>

                  <td
                    style={{
                      color:
                        product.quantity < product.minimumQuantity ||
                        product.quantity === 0
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {product.productName}
                  </td>

                  <td
                    style={{
                      color:
                        product.quantity < product.minimumQuantity ||
                        product.quantity === 0
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {product.costPrice}
                  </td>

                  <td
                    style={{
                      color:
                        product.quantity < product.minimumQuantity ||
                        product.quantity === 0
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {product.sellingPrice}
                  </td>

                  <td
                    style={{
                      color:
                        product.quantity < product.minimumQuantity ||
                        product.quantity === 0
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {product.quantity}
                  </td>

                  <td
                    style={{
                      color:
                        product.quantity < product.minimumQuantity ||
                        product.quantity === 0
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {product.minimumQuantity}
                  </td>

                  <td>
                    <Button
                      className="edit-btn"
                      onClick={() => editProduct(product)}
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ width: "83px" }}
                    >
                      Edit
                    </Button>
                  </td>

                  <td>
                    <Button
                      className="active-btn"
                      style={{
                        backgroundColor: product.isActive
                          ? "#198754"
                          : "#dc3545",

                        width: "83px",
                      }}
                      onClick={() => toggleStatus(product.productId)}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Grid>
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
