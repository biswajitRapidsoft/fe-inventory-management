// import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { apiEndPoint, baseUrl } from "../../../config/config";
// import axios from "axios";

// export default function AddEditProduct() {
//   const location = useLocation();
//   const [productId, setProductId] = useState(null);
//   const [productName, setProductName] = useState("");
//   const [productCategory, setProductCategory] = useState("");
//   const [costPrice, setCostPrice] = useState("");
//   const [sellingPrice, setSellingPrice] = useState("");
//   const [productQuantity, setProductQuantity] = useState("");
//   const [minQuantity, setMinQuantity] = useState("");
//   const [isActive, setIsActive] = useState(true);
//   const adminDetails = JSON.parse(localStorage.getItem("loginDetails"));
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (location.state && location.state.product) {
//       const {
//         productId,
//         productName,
//         productType,
//         costPrice,
//         sellingPrice,
//         quantity,
//         minimumQuantity,
//         isActive,
//       } = location.state.product;
//       setProductId(productId);
//       setProductName(productName);
//       setProductCategory(productType);
//       setCostPrice(costPrice);
//       setSellingPrice(sellingPrice);
//       setProductQuantity(quantity);
//       setMinQuantity(minimumQuantity);
//       setIsActive(isActive);
//     }
//   }, [location.state]);

//   const handleCancel = () => {
//     navigate("/landingpage/inventory");
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let newProduct = {
//       productId: productId,
//       adminId: adminDetails.adminId,
//       productName: productName,
//       productType: productCategory,
//       costPrice: costPrice,
//       sellingPrice: sellingPrice,
//       quantity: productQuantity,
//       minimumQuantity: minQuantity,
//       isActive: isActive,
//     };

//     try {
//       const response = await axios.post(
//         `${baseUrl}${apiEndPoint.addEditProduct}`,
//         newProduct,
//         {
//           headers: {
//             Authorization: `Bearer ${adminDetails.jwtToken}`,
//           },
//         }
//       );

//       console.log("Product modified successfully:", response.data);

//       setProductId(null);
//       setProductName("");
//       setProductCategory("");
//       setCostPrice("");
//       setSellingPrice("");
//       setProductQuantity("");
//       setMinQuantity("");
//     } catch (error) {
//       console.error(
//         "An error occurred while modifying the product:",
//         error.response.data
//       );
//     }
//   };

//   return (
//     <div className="add-edit-product">
//       <Paper sx={{ padding: 4, width: "100%" }}>
//         <form onSubmit={(e) => handleSubmit(e)}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Typography
//                 variant="h4"
//                 textAlign="center"
//                 sx={{ textDecoration: "underline" }}
//               >
//                 {location.state && location.state.product
//                   ? "Edit Product"
//                   : "Add Product"}
//               </Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Product Name"
//                 id="productName"
//                 name="productName"
//                 variant="outlined"
//                 type="text"
//                 required
//                 fullWidth
//                 margin="none"
//                 value={productName}
//                 onChange={(e) => setProductName(e.target.value)}
//                 sx={{ marginBottom: 2 }}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="Product Category"
//                 id="productCategory"
//                 name="productCategory"
//                 variant="outlined"
//                 type="text"
//                 required
//                 fullWidth
//                 margin="none"
//                 value={productCategory}
//                 onChange={(e) => setProductCategory(e.target.value)}
//                 sx={{ marginBottom: 2 }}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="Cost Price"
//                 id="costPrice"
//                 name="costPrice"
//                 variant="outlined"
//                 type="number"
//                 required
//                 fullWidth
//                 margin="none"
//                 value={costPrice}
//                 onChange={(e) => setCostPrice(e.target.value)}
//                 sx={{ marginBottom: 2 }}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="Selling Price"
//                 id="sellingPrice"
//                 name="sellingPrice"
//                 variant="outlined"
//                 type="number"
//                 required
//                 fullWidth
//                 margin="none"
//                 value={sellingPrice}
//                 onChange={(e) => setSellingPrice(e.target.value)}
//                 sx={{ marginBottom: 2 }}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="Product Quantity"
//                 id="productQuantity"
//                 name="productQuantity"
//                 variant="outlined"
//                 type="number"
//                 required
//                 fullWidth
//                 margin="none"
//                 value={productQuantity}
//                 onChange={(e) => setProductQuantity(e.target.value)}
//                 sx={{ marginBottom: 2 }}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="Minimum Quantity"
//                 id="minQuantity"
//                 name="minQuantity"
//                 variant="outlined"
//                 type="number"
//                 required
//                 fullWidth
//                 margin="none"
//                 value={minQuantity}
//                 onChange={(e) => setMinQuantity(e.target.value)}
//                 sx={{ marginBottom: 2 }}
//               />
//             </Grid>

//             <Grid item container xs={12} display="flex" justifyContent="center">
//               <Grid item>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   sx={{ fontSize: 20 }}
//                 >
//                   Submit
//                 </Button>
//               </Grid>

//               <Grid item>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={{ fontSize: 20 }}
//                   onClick={handleCancel}
//                 >
//                   Cancel
//                 </Button>
//               </Grid>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </div>
//   );
// }

import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
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
      console.error(
        "An error occurred while modifying the product:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="add-edit-product">
      <Paper sx={{ padding: 4, width: "100%" }}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Grid container spacing={2}>
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
            <Grid item xs={6}>
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
                onChange={(e) => setProductName(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            </Grid>

            <Grid item xs={6}>
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
                onChange={(e) => setProductCategory(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            </Grid>

            <Grid item xs={6}>
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
                onChange={(e) => setCostPrice(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            </Grid>

            <Grid item xs={6}>
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
                onChange={(e) => setSellingPrice(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            </Grid>

            <Grid item xs={6}>
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
                onChange={(e) => setProductQuantity(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            </Grid>

            <Grid item xs={6}>
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
                onChange={(e) => setMinQuantity(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            </Grid>

            <Grid item container xs={12} display="flex" justifyContent="center">
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ fontSize: 20 }}
                >
                  Submit
                </Button>
              </Grid>

              <Grid item>
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
      </Paper>
    </div>
  );
}
