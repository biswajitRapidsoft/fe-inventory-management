import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import config from "../../../config/config";
import { Snackbar, Alert } from "@mui/material";
export default function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState(
    location.state?.sortOption || "all"
  );
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${config.baseUrl}${config.apiEndPoint.allproduct}?adminId=${loginuser.adminId}`,
          {
            headers: {
              Authorization: `Bearer ${loginuser.jwtToken}`,
            },
          }
        );
        setProducts(
          response.data.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            sellingPrice: product.sellingPrice,
            costPrice: product.costPrice,
            productType: product.productType,
            quantity: product.quantity,
            minimumQuantity: product.minimumQuantity,
            productCode: product.productCode,
            isActive: product.isActive,
          }))
        );
      } catch (error) {
        handleTokenError(error);
      }
    };

    fetchProducts();
  }, [loginuser.adminId, loginuser.jwtToken]);

  const handleAddProduct = () => navigate("/landingpage/products/app-product");

  const handleUpdateProduct = (product) =>
    navigate("/landingpage/products/app-product", { state: { product } });

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const toggleProductActiveStatus = (product) => {
    return {
      ...product,
      isActive: !product.isActive,
    };
  };

  const handleisactive = async (product) => {
    const updatedProduct = toggleProductActiveStatus(product);

    const productData = {
      productId: String(updatedProduct.productId),
      adminId: String(loginuser.adminId),
      productName: updatedProduct.productName,
      productType: updatedProduct.productType,
      costPrice: String(updatedProduct.costPrice),
      sellingPrice: String(updatedProduct.sellingPrice),
      quantity: String(updatedProduct.quantity),
      minimumQuantity: String(updatedProduct.minimumQuantity),
      isActive: updatedProduct.isActive,
    };

    try {
      const apiUrl = `${config.baseUrl}${config.apiEndPoint.addproduct}`;

      await axios.post(apiUrl, productData, {
        headers: {
          Authorization: `Bearer ${loginuser.jwtToken}`,
        },
      });

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.productId === product.productId ? updatedProduct : p
        )
      );
    } catch (error) {
      handleTokenError(error);
    }
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const getFilteredProducts = () => {
    switch (sortOption) {
      case "outOfStock":
        return products.filter((product) => product.quantity === 0);
      case "lowStock":
        return products.filter(
          (product) =>
            product.quantity <= product.minimumQuantity && product.quantity > 0
        );
      case "active":
        return products.filter((product) => product.isActive);
      case "inactive":
        return products.filter((product) => !product.isActive);
      default:
        return products;
    }
  };

  const handleTokenError = (error) => {
    if (error.response) {
      const errorMessage = error.response.data.message;
      setError(errorMessage);
      setOpenSnackbar(true);

      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("loginDetails");
        navigate("/landingpage", {
          state: {
            errorMessage: "Invalid session, please login again",
          },
        });
      }
    } else {
      console.error("Error fetching order history:", error.message);
    }
    // if (
    //   (error.response && error.response.status === 403) ||
    //   (error.response && error.response.status === 401)
    // ) {
    //   localStorage.removeItem("loginuser");
    //   navigate("/landingpage", {
    //     state: {
    //       errorMessage: "Invalid session, please login again",
    //     },
    //   });
    // } else {
    //   console.error("Error:", error);
    // }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const filteredProducts = getFilteredProducts().filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="product-page">
      <div className="product-functionality">
        <div className="product-search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <SearchIcon sx={{ fontSize: 40 }} className="search-icon" />
        </div>
        <div className="product-sort">
          <select value={sortOption} onChange={handleSortChange}>
            <option value="all">All Products</option>
            <option value="outOfStock">Out of Stock</option>
            <option value="lowStock">Low Stock</option>
            <option value="active">Active Products</option>
            <option value="inactive">Inactive Products</option>
          </select>
        </div>
        <div className="product-add">
          <button onClick={handleAddProduct}>+ Add Product</button>
        </div>
      </div>

      <div className="product-table">
        <table>
          <thead>
            <tr>
              <th>Product code</th>
              <th>Product Name</th>
              <th>In Stock</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Product Type</th>
              <th>Update Quantity</th>
              <th>Delete Product</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.productId}
                style={{
                  color:
                    product.minimumQuantity >= product.quantity
                      ? "red"
                      : "black",
                  textDecoration: product.isActive ? "none" : "line-through",
                }}
              >
                <td>{product.productCode}</td>
                <td>{product.productName}</td>
                <td>{product.quantity}</td>
                <td>{product.costPrice}</td>
                <td>{product.sellingPrice}</td>
                <td>{product.productType}</td>
                <td>
                  <button onClick={() => handleUpdateProduct(product)}>
                    Update
                  </button>
                </td>
                <td>
                  <button onClick={() => handleisactive(product)}>
                    {product.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
