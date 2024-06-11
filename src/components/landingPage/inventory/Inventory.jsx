import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
      console.error("Error fetching products:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleActiveChange = (event) => {
    setActiveStatusFilter(event.target.value);
  };

  const toggleStatus = async (id) => {
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
  };

  const filteredProducts = products?.filter(
    (product) =>
      (product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productCode.toString().includes(searchQuery)) &&
      (activeStatusFilter === "all" ||
        (activeStatusFilter === "active" && product.isActive) ||
        (activeStatusFilter === "inactive" && !product.isActive))
  );

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
      <Grid
        item
        container
        xs={12}
        sx={{ height: "fit-content", marginBottom: "10px" }}
      >
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
          }}
        >
          <input
            className="search-inp"
            type="text"
            placeholder="Search by name"
            value={searchQuery}
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
          >
            Search
          </Button>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          container
          sx={{ justifyContent: "end", height: "fit-content" }}
          gap={1}
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
              Add Product
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
                        product.quantity < product.minimumQuantity
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {product.productCode}
                  </td>

                  <td
                    style={{
                      color:
                        product.quantity < product.minimumQuantity
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {product.productName}
                  </td>

                  <td
                    style={{
                      color:
                        product.quantity < product.minimumQuantity
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {product.costPrice}
                  </td>

                  <td
                    style={{
                      color:
                        product.quantity < product.minimumQuantity
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {product.sellingPrice}
                  </td>

                  <td
                    style={{
                      color:
                        product.quantity < product.minimumQuantity
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {product.quantity}
                  </td>

                  <td
                    style={{
                      color:
                        product.quantity < product.minimumQuantity
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
    </Grid>
  );
}
