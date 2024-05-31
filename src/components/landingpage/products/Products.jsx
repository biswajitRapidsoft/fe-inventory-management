import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([
    {
      id: "123",
      name: "iphone",
      stock: "100",
      sellingPrice: "100000",
      costPrice: "50000",
      type: "electronic",
    },
  ]);

  useEffect(() => {
    const apiUrl = "https://api.example.com/products";

    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);
  const handleaddproduct = () => {
    navigate("/landingpage/products/app-product");
  };
  return (
    <div className="product-page">
      <div className="product-functionality">
        <div className="product-search">
          <input type="text" placeholder="Search products..." />
          <SearchIcon sx={{ fontSize: 40 }} className="search-icon" />
        </div>

        <div className="product-add">
          <button onClick={handleaddproduct}>+ Add Products</button>
        </div>
      </div>

      <div className="product-table">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Stock</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Product Type</th>
              <th>Update Quantity</th>
              <th>dekete product</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td>{product.costPrice}</td>
                <td>{product.sellingPrice}</td>
                <td>{product.type}</td>
                <td>
                  <button>update</button>
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
