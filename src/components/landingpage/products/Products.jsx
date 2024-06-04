import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import config from "../../../config/config";
export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${config.baseUrl}${config.apiEndPoint.allproduct}`,
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
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => navigate("/landingpage/products/app-product");

  const handleUpdateProduct = (product) =>
    navigate("/landingpage/products/app-product", { state: { product } });

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const filteredProducts = products.filter((product) =>
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
              <th>Stock</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Product Type</th>
              <th>Update Quantity</th>
              <th>Delete Product</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.productId}>
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
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
