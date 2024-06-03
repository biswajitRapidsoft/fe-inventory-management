import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";

const Addbill = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [description, setDescription] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

  useEffect(() => {
    const fetchProductOptions = async () => {
      try {
        const response = await axios.get(
          "http://192.168.12.57:8080/admin/product/all",
          {
            headers: {
              Authorization: `Bearer ${loginuser.jwtToken}`,
            },
          }
        );
        const products = response.data.map((product) => ({
          id: product.productId,
          name: product.productName,
          quantity: product.quantity,
          sellingPrice: product.sellingPrice,
          productCode: product.productCode,
        }));
        setProductOptions(products);
      } catch (error) {
        console.error("Failed to fetch product options", error);
      }
    };

    fetchProductOptions();
  }, [loginuser.jwtToken]);

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: "",
        name: "",
        quantity: 1,
        sellingPrice: 0,
        maxQuantity: 1,
        productCode: "",
      },
    ]);
  };

  const handleProductIdChange = (index, value) => {
    const selectedProduct = productOptions.find(
      (product) => product.id === parseInt(value)
    );

    if (
      selectedProduct &&
      products.some((product) => product.id === selectedProduct.id)
    ) {
      alert("This product is already added.");
      return;
    }

    const newProducts = [...products];
    if (selectedProduct) {
      newProducts[index] = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        quantity: 1,
        sellingPrice: selectedProduct.sellingPrice,
        maxQuantity: selectedProduct.quantity,
        productCode: selectedProduct.productCode,
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

  const handleSave = async () => {
    const items = products.map((product) => ({
      productId: product.id,
      sellingPrice: product.sellingPrice,
      productCode: product.productCode,
      count: product.quantity,
    }));

    const order = {
      userId: loginuser.userId,
      customerName,
      description,
      phoneNo: customerNumber,
      products: items,
      totalAmount,
    };

    try {
      const response = await axios.post(
        "http://192.168.12.57:8080/admin/orders",
        order,
        {
          headers: {
            Authorization: `Bearer ${loginuser.jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Invoice created:", response.data);
        navigate("/landingpage/billing");
      } else {
        console.error("Failed to save order");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/landingpage/billing");
  };

  return (
    <div className="add-bill">
      <div className="bill-header">
        <div className="bill-amount">
          <p>Total amount</p>
          <h2>Rs {totalAmount}</h2>
        </div>
        <div className="bill-date">
          <p>Date</p>
          <h2>{date}</h2>
        </div>
      </div>

      <div className="bill-customer">
        <label>Customer Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>
      <div className="bill-customer">
        <label>Customer Number</label>
        <input
          type="tel"
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)}
        />
      </div>

      <div className="bill-description">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="bill-products">
        <div className="add-product-button-container">
          <h3>Products</h3>
          <button onClick={handleAddProduct} className="add-product-button">
            + Add product
          </button>
        </div>

        {products.map((product, index) => (
          <div key={index} className="product-row">
            <select
              value={product.id}
              onChange={(e) => handleProductIdChange(index, e.target.value)}
            >
              <option value="">Select Product</option>
              {productOptions.map((option) => (
                <option
                  key={option.id}
                  value={option.id}
                  disabled={products.some((prod) => prod.id === option.id)}
                >
                  {option.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={product.quantity}
              max={product.maxQuantity}
              onChange={(e) =>
                handleProductQuantityChange(index, e.target.value)
              }
            />
            <span className="product-price">₹{product.sellingPrice}</span>
            <button
              onClick={() => handleRemoveProduct(index)}
              className="remove-product-button"
            >
              <CancelIcon />
            </button>
          </div>
        ))}
      </div>

      <div className="bill-actions">
        <button onClick={handleSave} className="save-button">
          Save
        </button>
        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Addbill;
