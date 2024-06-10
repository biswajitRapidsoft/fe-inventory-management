import React, { useRef } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function OrderDetails() {
  const adminDetails = JSON.parse(localStorage.getItem("loginDetails"));
  const location = useLocation();
  const { order } = location.state;
  const invoiceRef = useRef();

  const handleDownload = () => {
    generateInvoice(order, adminDetails);
  };

  const generateInvoice = (bill, adminDetails) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor("#000000");
    doc.text("INVOICE", 105, 10, { align: "center" });

    doc.setFontSize(12);
    const leftAlign = 14;
    const rightAlign = 105;
    const topMargin = 30;
    const lineSpacing = 10;

    const details = [
      [`Order ID:`, bill.orderId],
      [`Customer Name:`, bill.customerName],
      [`Phone No:`, bill.phoneNo],
      [`Description:`, bill.description],
      [`Date:`, new Date(bill.date).toLocaleDateString()],
      [`Sold By:`, adminDetails.userName],
    ];

    details.forEach((detail, index) => {
      const yPosition = topMargin + index * lineSpacing;
      doc.text(detail[0], leftAlign, yPosition);
      doc.text(detail[1], rightAlign, yPosition);
    });

    const tableColumn = ["Code", "Name", "QTY", "Price", "Total Price"];
    const tableRows = [];

    bill.products.forEach((product) => {
      const productData = [
        product.productCode,
        product.productName,
        product.quantity,
        product.sellingPrice.toFixed(2),
        (product.sellingPrice * product.quantity).toFixed(2),
      ];
      tableRows.push(productData);
    });

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: topMargin + details.length * lineSpacing + 10,
      styles: {
        halign: "center",
        fontSize: 10,
        textColor: [0, 0, 0],
      },
      theme: "striped",
      headStyles: {
        fillColor: [114, 134, 211],
        textColor: [255, 255, 255],
      },
      didDrawPage: function (data) {
        let footerStr = "Page " + doc.internal.getNumberOfPages();
        if (typeof doc.putTotalPages === "function") {
          footerStr = footerStr + " of " + totalPagesExp;
        }
        doc.setFontSize(10);
        doc.text(
          footerStr,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );

        const totalAmountStr = `Total Amount: ${bill.totalAmount.toFixed(2)}`;
        doc.setTextColor("#ff0000");
        doc.setFontSize(12);
        const totalAmountWidth = doc.getTextWidth(totalAmountStr);
        const totalAmountX =
          doc.internal.pageSize.width - totalAmountWidth - 10;
        const totalAmountY = data.cursor.y + 15;
        doc.text(totalAmountStr, totalAmountX, totalAmountY);
      },
    });

    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp);
    }

    doc.save(`invoice_${bill.orderId}.pdf`);
  };

  return (
    <Grid
      container
      className="order-details-container"
      sx={{ padding: "20px", height: "100%", gap: 2 }}
      ref={invoiceRef}
    >
      <Grid item xs={12}>
        <Typography
          variant="h5"
          sx={{ textDecoration: "underline", marginBottom: "15px" }}
          textAlign="center"
        >
          INVOICE
        </Typography>
      </Grid>

      <Grid
        item
        container
        className="invoice-container"
        spacing={2}
        xs={12}
        md={12}
      >
        <Grid item xs={12}>
          <Paper sx={{ padding: "14px" }}>
            <Grid container spacing={2}>
              <Grid item sm={12} md={6} className="info-item">
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography variant="h6">Order Id:</Typography>
                  </Grid>
                  <Grid item sx={{ marginLeft: "10px" }}>
                    <Typography variant="body1">{order.orderId}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={6} className="info-item">
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography variant="h6">Customer Name:</Typography>
                  </Grid>
                  <Grid item sx={{ marginLeft: "10px" }}>
                    <Typography variant="body1">
                      {order.customerName}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={6} className="info-item">
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography variant="h6">Phone No.:</Typography>
                  </Grid>
                  <Grid item sx={{ marginLeft: "10px" }}>
                    <Typography variant="body1">{order.phoneNo}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item sm={12} md={6} className="info-item">
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography variant="h6">Total Amount:</Typography>
                  </Grid>
                  <Grid item sx={{ marginLeft: "10px" }}>
                    <Typography variant="body1">
                      ₹{order.totalAmount.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={6} className="info-item">
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography variant="h6">Date:</Typography>
                  </Grid>
                  <Grid item sx={{ marginLeft: "10px" }}>
                    <Typography variant="body1">
                      {new Date(order.date).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={6} className="info-item">
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography variant="h6">Sold By:</Typography>
                  </Grid>
                  <Grid item sx={{ marginLeft: "10px" }}>
                    <Typography variant="body1">
                      {adminDetails.userName}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={6} className="info-item">
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography variant="h6">Description:</Typography>
                  </Grid>
                  <Grid item sx={{ marginLeft: "10px" }}>
                    <Typography variant="body1">{order.description}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper>
            <TableContainer>
              <Table aria-label="product details table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ backgroundColor: "#7286d3" }}>
                      <h4>Product Code</h4>
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ backgroundColor: "#7286d3" }}
                    >
                      <h4>Product Name</h4>
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ backgroundColor: "#7286d3" }}
                    >
                      <h4>Selling Price</h4>
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ backgroundColor: "#7286d3" }}
                    >
                      <h4>Quantity</h4>
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ backgroundColor: "#7286d3" }}
                    >
                      <h4>Total Price</h4>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.productCode}</TableCell>
                      <TableCell align="center">
                        {product.productName}
                      </TableCell>
                      <TableCell align="center">
                        ₹{product.sellingPrice.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">{product.quantity}</TableCell>
                      <TableCell align="center">
                        ₹{(product.sellingPrice * product.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ textAlign: "center", marginTop: "auto" }}>
        <Button variant="contained" color="primary" onClick={handleDownload}>
          Download Invoice
        </Button>
      </Grid>
    </Grid>
  );
}
