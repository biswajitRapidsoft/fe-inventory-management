import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import config from "../../../config/config";
import { MuiTelInput } from "mui-tel-input";

const AddBill = () => {
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
      } catch (error) {
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
      alert(
        "Please provide customer name, customer number, description, and add at least one product."
      );
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

  const handleChange = (newValue) => {
    setCustomerNumber(newValue);
  };

  return (
    <div className="add-bill">
      <form onSubmit={handleSave}>
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
            required
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div className="bill-customer">
          <MuiTelInput value={customerNumber} onChange={handleChange} />
        </div>

        <div className="bill-description">
          <label>Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="bill-products">
          <div className="add-product-button-container">
            <h3>Products</h3>
            <button
              type="button"
              onClick={handleAddProduct}
              className="add-product-button"
            >
              + Add product
            </button>
          </div>

          {products.map((product, index) => (
            <div key={index} className="product-row">
              <div className="product-row-name">
                <Autocomplete
                  className="autocomplete"
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
                    />
                  )}
                />
                <input
                  className="quantity"
                  type="number"
                  value={product.quantity}
                  max={product.maxQuantity}
                  min={0}
                  onChange={(e) =>
                    handleProductQuantityChange(index, e.target.value)
                  }
                  required
                />
              </div>
              <div className="product-row-amount">
                <span className="product-price">₹{product.totalPrice}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(index)}
                  className="remove-product-button"
                >
                  <CancelIcon />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bill-actions">
          <button type="submit" className="save-button">
            Save
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBill;
