const config = Object.freeze({
  baseUrl: "http://192.168.12.57:8080/",
  // baseUrl: "http://192.168.12.48:8080/",
  // baseUrl: "http://192.168.12.55:8008/",

  apiEndPoint: {
    login: "admin/login",
    // login: "ims/signin",
    // login: "IMS/login",
    sigup: "admin/signup",
    // sigup: "ims/signup",
    // sigup: "IMS/signup",
    allproduct: "admin/product/all",
  },
});

export default config;
