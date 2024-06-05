const config = Object.freeze({
  baseUrl: "http://192.168.12.57:8080/",

  apiEndPoint: {
    login: "admin/login",
    sigup: "admin/signup",
    allproduct: "admin/product/all",
    addproduct: "admin/product/create-update",
    allbill: "admin/invoice",
    addbill: "admin/product/sales",
  },
});

// const config = Object.freeze({
//   baseUrl: "http://192.168.12.48:8080/",

//   apiEndPoint: {
//     login: "ims/signin",
//     sigup: "ims/signup",
//     allproduct: "ims/getProducts",
//     addproduct: "ims/addProduct",
//   },
// });

// const config = Object.freeze({
//   baseUrl: "http://192.168.12.55:8008/",

//   apiEndPoint: {
//     login: "IMS/login",
//     sigup: "IMS/signup",
//     allproduct: "admin/product/all",
//   },
// });

export default config;
