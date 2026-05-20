import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error Formatting Date";
  }
};

const handleDownloadPdf = (base64Data, fileName) => {
  try {
    const actualBase64 = base64Data.includes(",")
      ? base64Data.split(",")[1]
      : base64Data;
    if (!actualBase64) {
      throw new Error("Base64 data is empty or invalid after splitting.");
    }

    const byteCharacters = atob(actualBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error opening PDF:", error);
    alert(
      "Failed to open PDF. The file might be corrupted or not a valid base64 PDF."
    );
  }
};

const CustomerApproveAccordian = ({ claim }) => {
  const API_ENDPOINT = `http://localhost:9090`;

  // States for form inputs
  const [billRows, setBillRows] = useState([
    { head: "", billAmount: "", deduction: "", settled: "" },
  ]);
  const [insurerMessage, setInsurerMessage] = useState("");

  const [billLoading, setBillLoading] = useState(false);
  const [billError, setBillError] = useState("");
  const [billSuccess, setBillSuccess] = useState("");

  const [isClaimApproved, setIsClaimApproved] = useState(false);
  const [isEditingApprovedDetails, setIsEditingApprovedDetails] =
    useState(false);
  const [approvedAmountDisplay, setApprovedAmountDisplay] = useState(0);
  const [generatedPdfBase64, setGeneratedPdfBase64] = useState(null);

  // Memoize fetchCustomerName
  const fetchCustomerName = useCallback(
    async (customerId) => {
      if (!customerId) return "N/A";
      try {
        const res = await axios.get(`${API_ENDPOINT}/customers/${customerId}`);
        return res.data?.name || "Unknown Customer";
      } catch {
        return "Unknown Customer";
      }
    },
    [API_ENDPOINT]
  );

  // Memoize fetchClaimType
  const fetchClaimType = useCallback(
    async (claimTypeId) => {
      if (!claimTypeId) return "Not specified";
      try {
        const res = await axios.get(
          `${API_ENDPOINT}/claimTypes/${claimTypeId}`
        );
        return res.data?.type || "Unknown Claim Type";
      } catch {
        return "Unknown Claim Type";
      }
    },
    [API_ENDPOINT]
  );

  useEffect(() => {
    if (
      claim.insurerStatus === "CLAIM_APPROVED" &&
      claim.finalClaimSettlement?.insurerApprovedAmount !== null &&
      claim.finalClaimSettlement?.insurerApprovedAmount !== undefined
    ) {
      setIsClaimApproved(true);
      setApprovedAmountDisplay(
        claim.finalClaimSettlement.insurerApprovedAmount || 0
      );
      setInsurerMessage(claim.finalClaimSettlement.insurerMessage || "");
      setGeneratedPdfBase64(
        claim.finalClaimSettlement.insurerFinalBill || null
      );
      setIsEditingApprovedDetails(false);
      // Populate billRows if available in finalClaimSettlement, otherwise initialize
      // For simplicity, this example doesn't dynamically load old billRows from finalClaimSettlement
      // as your schema doesn't currently store them. If you add it, load here.
      setBillRows([{ head: "", billAmount: "", deduction: "", settled: "" }]);
    } else {
      setIsClaimApproved(false);
      setApprovedAmountDisplay(0);
      setInsurerMessage("");
      setGeneratedPdfBase64(null);
      setBillRows([{ head: "", billAmount: "", deduction: "", settled: "" }]);
      setIsEditingApprovedDetails(true);
    }
    setBillError("");
    setBillSuccess("");
  }, [claim]);

  const handleBillRowChange = (idx, field, value) => {
    setBillRows((rows) =>
      rows.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  const handleAddBillRow = () => {
    setBillRows((rows) => [
      ...rows,
      { head: "", billAmount: "", deduction: "", settled: "" },
    ]);
  };

  const handleEditApprovedMessage = () => {
    setIsEditingApprovedDetails(true);
    setBillError("");
    setBillSuccess("");
  };

  const handleSubmitApproval = async () => {
    setBillLoading(true);
    setBillError("");
    setBillSuccess("");

    try {
      let totalBill = 0;
      let totalDeduction = 0;
      let totalSettled = 0;

      // Only calculate totals from billRows if we are in new approval mode or editing
      if (!isClaimApproved || isEditingApprovedDetails) {
        billRows.forEach((row) => {
          totalBill += parseFloat(row.billAmount || 0);
          totalDeduction += parseFloat(row.deduction || 0);
          totalSettled += parseFloat(row.settled || 0);
        });
      } else {
        // If already approved and not editing, use the existing approved amount for calculations
        totalSettled = approvedAmountDisplay;
      }

      // These are fixed for now, as per the previous logic
      const coPay = 0;
      const discount = 0;
      const payableAmount = totalSettled + coPay + discount; // This is the Insurer Approved Amount

      let pdfBase64 = generatedPdfBase64; // Use existing PDF if not generating new one

      // Only generate new PDF if it's a new approval or if we're editing and need to regenerate
      if (!isClaimApproved || isEditingApprovedDetails) {
        // Fetch customer details for PDF generation
        const customerRes = await axios.get(
          `${API_ENDPOINT}/customers/${claim.customerId}`
        );
        const customer = customerRes.data;
        const claimTypeName = await fetchClaimType(claim.claimTypeId);

        // --- PDF Generation ---
        const doc = new jsPDF();
        let yPos = 15; // Starting Y position

        // Header and Recipient Info
        doc.setFontSize(10);
        doc.text(`Date: ${formatDate(new Date().toISOString())}`, 170, yPos);
        yPos += 10;
        doc.text(`To,`, 20, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.text(`${customer.name || "N/A"}`, 20, yPos);
        yPos += 7;
        doc.setFontSize(10);
        doc.text(`${customer.address || "N/A"}`, 20, yPos);
        yPos += 7;
        doc.text(
          `State: ${customer.state || "N/A"}, City: ${customer.city || "N/A"}`,
          20,
          yPos
        );
        yPos += 7;
        doc.text(`Pin: ${customer.pin || "N/A"}`, 20, yPos);
        yPos += 15;

        // Subject and Claim Details
        doc.setFontSize(11);
        doc.text(`Dear Sir/Madam,`, 20, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.text(
          `SUBJECT: Claim Settlement Advice (Claim ID: ${claim.id})`,
          20,
          yPos
        );
        yPos += 12;

        doc.setFontSize(10);
        doc.text(`Proposer/Employee Name: ${customer.name || "N/A"}`, 20, yPos);
        doc.text(`Patient Name: ${customer.name || "N/A"}`, 100, yPos); // Assuming patient is also the customer for reimbursement
        doc.text(`Age: ${customer.age || "N/A"}`, 170, yPos);
        yPos += 7;
        doc.text(`Policy No.: ${customer.policyNo || "N/A"}`, 20, yPos);
        doc.text(
          `Policy Validity: ${customer.policyValidity || "N/A"}`,
          100,
          yPos
        );
        yPos += 7;
        // Removed Hospital Name, DOA, DOD as they are not in the provided customer claim schema
        doc.text(`Claim Type: ${claimTypeName || "N/A"}`, 20, yPos);
        doc.text(
          `Amount Claimed: ₹${claim.costOfTreatment || "N/A"}`, // Use costOfTreatment
          100,
          yPos
        );
        doc.text(`Amount Settled: ₹${payableAmount}`, 170, yPos);
        yPos += 15;

        doc.text(
          `As per the instructions of the insurer, the claim for ${claimTypeName || "N/A"} is settled for ₹${payableAmount}.`,
          20,
          yPos
        );
        yPos += 10;

        // Table for deductions
        autoTable(doc, {
          startY: yPos,
          head: [
            [
              "Heads",
              "Bill Amount (Rs.)",
              "Deduction Amount (Rs.)",
              "Settled Amount (Rs.)",
            ],
          ],
          body: billRows.map((row) => [
            row.head,
            parseFloat(row.billAmount || 0).toFixed(2),
            parseFloat(row.deduction || 0).toFixed(2),
            parseFloat(row.settled || 0).toFixed(2),
          ]),
          theme: "grid",
          styles: { fontSize: 9, cellPadding: 2, overflow: "linebreak" },
          headStyles: {
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: "bold",
          },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 40, halign: "right" },
            2: { cellWidth: 40, halign: "right" },
            3: { cellWidth: 40, halign: "right" },
          },
        });

        yPos = doc.lastAutoTable.finalY + 6;
        doc.text(`Total:`, 20, yPos);
        doc.text(`₹${totalBill.toFixed(2)}`, 70, yPos, { align: "right" });
        doc.text(`₹${totalDeduction.toFixed(2)}`, 110, yPos, {
          align: "right",
        });
        doc.text(`₹${totalSettled.toFixed(2)}`, 150, yPos, { align: "right" });
        yPos += 8;
        doc.text(`Co-pay: ₹${coPay.toFixed(2)}`, 20, yPos);
        yPos += 8;
        doc.text(`Discount: ₹${discount.toFixed(2)}`, 20, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.text(`Payable Amount: ₹${payableAmount.toFixed(2)}`, 20, yPos);
        yPos += 12;

        if (insurerMessage) {
          doc.setFontSize(10);
          doc.text(`Insurer Message: ${insurerMessage}`, 20, yPos);
          yPos += 12;
        }

        doc.setFontSize(10);
        doc.text(
          `Sincerely yours,\nTEAM\nHeritage Health Insurance TPA Pvt. Ltd.\n[NB: This is a computer generated letter and no signature is required.]`,
          20,
          yPos
        );

        pdfBase64 = doc.output("dataurlstring");
      }

      // Update claim with final settlement
      const updatePayload = {
        insurerStatus: "CLAIM_APPROVED", // Always set to APPROVED on approval/update
        finalClaimSettlement: {
          insurerApprovedAmount: payableAmount,
          insurerFinalBill: pdfBase64,
          insurerMessage,
        },
        // Ensures updatedAt is in the correct format for json-server
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      await axios.patch(
        `${API_ENDPOINT}/customerclaims/${claim.id}`,
        updatePayload
      );

      setBillSuccess(
        isClaimApproved
          ? "Approved claim details updated successfully!"
          : "Claim approved and bill generated!"
      );
      setIsEditingApprovedDetails(false);
      setApprovedAmountDisplay(payableAmount);
      setGeneratedPdfBase64(pdfBase64);
    } catch (err) {
      console.error("Failed to approve claim and generate bill:", err);
      setBillError(
        `Failed to approve claim and generate bill: ${
          err.message ||
          err.response?.statusText ||
          "An unknown error occurred."
        }`
      );
    } finally {
      setBillLoading(false);
    }
  };

  return (
    <Accordion sx={{ mt: 2, borderRadius: "8px" }} elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">
          {isClaimApproved
            ? "Approved Claim Details"
            : "Approve & Generate Bill"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {billLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 1 }}>Processing...</Typography>
          </Box>
        )}
        {billError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {billError}
          </Alert>
        )}
        {billSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {billSuccess}
          </Alert>
        )}

        {isClaimApproved && !isEditingApprovedDetails ? (
          // Display approved details
          <Box>
            <Typography variant="body1" gutterBottom>
              <strong>Approved Amount:</strong> ₹
              {approvedAmountDisplay.toFixed(2)}
            </Typography>
            {insurerMessage && (
              <Typography variant="body2" gutterBottom>
                <strong>Insurer Message:</strong> {insurerMessage}
              </Typography>
            )}
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              {generatedPdfBase64 && (
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() =>
                    handleDownloadPdf(
                      generatedPdfBase64,
                      `Approved_Bill_${claim.id}.pdf`
                    )
                  }
                >
                  Download Approved Bill
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={handleEditApprovedMessage}
                disabled={billLoading}
              >
                Edit Message
              </Button>
            </Box>
          </Box>
        ) : (
          // Input fields for new approval or editing
          <>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Heads</TableCell>
                    <TableCell align="right">Bill Amount (Rs.)</TableCell>
                    <TableCell align="right">Deduction Amount (Rs.)</TableCell>
                    <TableCell align="right">Settled Amount (Rs.)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billRows.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <TextField
                          value={row.head}
                          onChange={(e) =>
                            handleBillRowChange(idx, "head", e.target.value)
                          }
                          size="small"
                          fullWidth
                          disabled={billLoading}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={row.billAmount}
                          onChange={(e) =>
                            handleBillRowChange(
                              idx,
                              "billAmount",
                              e.target.value
                            )
                          }
                          size="small"
                          fullWidth
                          disabled={billLoading}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={row.deduction}
                          onChange={(e) =>
                            handleBillRowChange(
                              idx,
                              "deduction",
                              e.target.value
                            )
                          }
                          size="small"
                          fullWidth
                          disabled={billLoading}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={row.settled}
                          onChange={(e) =>
                            handleBillRowChange(idx, "settled", e.target.value)
                          }
                          size="small"
                          fullWidth
                          disabled={billLoading}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddBillRow}
              sx={{ mt: 2, mb: 2 }}
              disabled={billLoading}
            >
              Add Row
            </Button>
            <TextField
              label="Insurer Message"
              fullWidth
              multiline
              rows={3}
              value={insurerMessage}
              onChange={(e) => setInsurerMessage(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
              disabled={billLoading}
            />
            <Button
              variant="contained"
              color="success"
              startIcon={<SendIcon />}
              onClick={handleSubmitApproval}
              sx={{ mt: 2 }}
              disabled={
                billLoading ||
                billRows.some(
                  (row) => !row.head || !row.billAmount || !row.settled
                )
              }
              fullWidth
            >
              {billLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isClaimApproved ? (
                "Update Message & Regenerate Bill"
              ) : (
                "Approve & Generate Bill"
              )}
            </Button>
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomerApproveAccordian;
