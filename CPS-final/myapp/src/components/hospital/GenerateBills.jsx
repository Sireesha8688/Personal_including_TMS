import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useTheme,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import jsPDF from "jspdf";

const GenerateBills = ({ loggedInHospitalId }) => {
  const theme = useTheme();

  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [preauth, setPreauth] = useState(null);
  const [patient, setPatient] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fileInputRef = useRef();

  // Calculate cost breakdown
  const getCostBreakdown = (totalCost) => {
    const roomRent = 2000;
    const remaining = totalCost - roomRent;
    const hospitalCharges = Math.round(remaining * 0.4);
    const treatmentCost = remaining - hospitalCharges;
    return { roomRent, hospitalCharges, treatmentCost };
  };

  // Fetch hospital info on mount or when hospitalId changes
  useEffect(() => {
    if (!loggedInHospitalId) return;
    const fetchHospital = async () => {
      try {
        const res = await axios.get(`http://localhost:9090/hospitals/${loggedInHospitalId}`);
        setHospital(res.data);
      } catch (err) {
        setHospital(null);
      }
    };
    fetchHospital();
  }, [loggedInHospitalId]);

  // Fetch all data by patientId
  const fetchData = async () => {
    if (!patientId.trim()) {
      setError("Please enter a Patient ID.");
      return;
    }
    setLoading(true);
    setError(null);
    setUploadSuccess(null);
    setPreauth(null);
    setPatient(null);
    setPolicies([]);
    setSelectedFiles([]);

    try {
      const preauthRes = await axios.get(`http://localhost:9090/preauths/${patientId}`);
      const preauthData = preauthRes.data;
      setPreauth(preauthData);

      const patientRes = await axios.get(`http://localhost:9090/customers/${preauthData.customerId}`);
      setPatient(patientRes.data);

      const policiesRes = await axios.get("http://localhost:9090/policy");
      const patientPolicyIds = patientRes.data.policies
        ? patientRes.data.policies.map((p) => p.policyId.toString())
        : preauthData.policyIds.map((id) => id.toString());

      const filteredPolicies = policiesRes.data.filter((policy) =>
        patientPolicyIds.includes(policy.id.toString())
      );
      setPolicies(filteredPolicies);
    } catch (err) {
      setError("Failed to fetch data. Please check Patient ID.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total sum assured from policies
  const totalSumAssured = policies.reduce((acc, pol) => acc + (pol.sumAssured || 0), 0);

  // Calculate insurance coverage capped by sum assured
  const insuranceCoveredAmount = preauth ? Math.min(preauth.cost, totalSumAssured) : 0;

  // Amount patient needs to pay
  const patientPayableAmount = preauth ? preauth.cost - insuranceCoveredAmount : 0;

  // Discharge summary
  const dischargeSummary = preauth && patient
    ? `Patient ${patient.name} was treated for "${preauth.treatment}" on ${preauth.date}. The total cost was ₹${preauth.cost.toLocaleString()}. The patient received excellent support during the treatment and has been medically discharged successfully.`
    : "";

  // Generate and download PDF receipt using jsPDF
  const handleDownloadReceipt = () => {
    if (!preauth || !patient || !hospital) return;

    const doc = new jsPDF();

    let y = 10;
    const lineHeight = 8;

    doc.setFontSize(16);
    doc.text("Hospital Claim Receipt", 105, y, null, null, "center");
    y += lineHeight * 2;

    doc.setFontSize(12);
    doc.text("Patient Information:", 10, y);
    y += lineHeight;
    doc.text(`Name: ${patient.name}`, 10, y);
    y += lineHeight;
    doc.text(`Aadhaar: ${patient.aadharcardNumber}`, 10, y);
    y += lineHeight;
    doc.text(`Email: ${patient.email}`, 10, y);
    y += lineHeight * 2;

    doc.text("Hospital Information:", 10, y);
    y += lineHeight;
    doc.text(`Name: ${hospital.name}`, 10, y);
    y += lineHeight;
    doc.text(
      `Address: ${hospital.address.street}, ${hospital.address.city}, ${hospital.address.state}, ${hospital.address.pincode}`,
      10,
      y
    );
    y += lineHeight;
    doc.text(`Email: ${hospital.contact_info.email}`, 10, y);
    y += lineHeight;
    doc.text(`Phone: ${hospital.contact_info.phone}`, 10, y);
    y += lineHeight * 2;

    doc.text("Treatment Details:", 10, y);
    y += lineHeight;
    doc.text(`Treatment: ${preauth.treatment}`, 10, y);
    y += lineHeight;
    doc.text(`Date: ${preauth.date}`, 10, y);
    y += lineHeight;
    doc.text(`Status: ${preauth.status}`, 10, y);
    y += lineHeight;
    doc.text(`Total Cost: ₹${preauth.cost.toLocaleString()}`, 10, y);
    y += lineHeight * 2;

    const costBreakdown = getCostBreakdown(preauth.cost);
    doc.text("Cost Breakdown:", 10, y);
    y += lineHeight;
    doc.text(`Room Rent: ₹${costBreakdown.roomRent.toLocaleString()}`, 10, y);
    y += lineHeight;
    doc.text(`Hospital Charges: ₹${costBreakdown.hospitalCharges.toLocaleString()}`, 10, y);
    y += lineHeight;
    doc.text(`Treatment Cost: ₹${costBreakdown.treatmentCost.toLocaleString()}`, 10, y);
    y += lineHeight * 2;

    doc.text("Insurance Coverage & Payment:", 10, y);
    y += lineHeight;
    doc.text(`Covered by Insurance: ₹${insuranceCoveredAmount.toLocaleString()}`, 10, y);
    y += lineHeight;
    doc.text(`Amount to be Paid by Patient: ₹${patientPayableAmount.toLocaleString()}`, 10, y);
    y += lineHeight * 2;

    doc.text("Discharge Summary:", 10, y);
    y += lineHeight;
    const splitSummary = doc.splitTextToSize(dischargeSummary, 190);
    doc.text(splitSummary, 10, y);

    doc.save(`Claim_Receipt_${patientId}.pdf`);
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
    setUploadSuccess(null);
    setError(null);
  };

  // Handle file upload and update db.json (simulate file path as file name)
  const handleUploadFiles = async () => {
    if (!preauth) {
      setError("Please load patient data before uploading.");
      return;
    }
    if (!selectedFiles.length) {
      setError("Please select files to upload.");
      return;
    }
    setUploading(true);
    setError(null);
    setUploadSuccess(null);

    try {
      const uploadedFiles = selectedFiles.map((file) => ({
        name: file.name,
        path: `/uploads/${file.name}`, // Simulated path
        uploadedAt: new Date().toISOString(),
      }));

      const updatedDocuments = preauth.documents
        ? [...preauth.documents, ...uploadedFiles]
        : [...uploadedFiles];

      // Patch preauth in db.json
      await axios.patch(`http://localhost:9090/preauths/${preauth.id}`, {
        documents: updatedDocuments,
      });

      setPreauth({ ...preauth, documents: updatedDocuments });
      setUploadSuccess("File(s) uploaded successfully!");
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Download uploaded files (simulate)
  const handleDownloadUploadedFile = (file) => {
    // For demo, just download a blank file with the file name
    const blob = new Blob([""], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const costBreakdown = preauth ? getCostBreakdown(preauth.cost) : null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Claim Support
      </Typography>

      <TextField
        label="Enter Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        disabled={loading}
      />
      <Button
        variant="contained"
        onClick={fetchData}
        disabled={loading || !patientId.trim()}
        sx={{ mb: 3 }}
      >
        {loading ? "Loading..." : "Fetch Claim Details"}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {uploadSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {uploadSuccess}
        </Alert>
      )}

      {preauth && patient && hospital && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Patient Information
          </Typography>
          <Typography><b>Name:</b> {patient.name}</Typography>
          <Typography><b>Aadhaar:</b> {patient.aadharcardNumber}</Typography>
          <Typography><b>Email:</b> {patient.email}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Hospital Information
          </Typography>
          <Typography><b>Name:</b> {hospital.name}</Typography>
          <Typography>
            <b>Address:</b> {hospital.address.street}, {hospital.address.city}, {hospital.address.state}, {hospital.address.pincode}
          </Typography>
          <Typography><b>Email:</b> {hospital.contact_info.email}</Typography>
          <Typography><b>Phone:</b> {hospital.contact_info.phone}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Treatment Details
          </Typography>
          <Typography><b>Treatment:</b> {preauth.treatment}</Typography>
          <Typography><b>Date:</b> {preauth.date}</Typography>
          <Typography><b>Status:</b> {preauth.status}</Typography>
          <Typography><b>Total Cost:</b> ₹{preauth.cost.toLocaleString()}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Cost Breakdown
          </Typography>
          {costBreakdown && (
            <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Cost Component</TableCell>
                    <TableCell align="right">Amount (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Room Rent</TableCell>
                    <TableCell align="right">{costBreakdown.roomRent.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Hospital Charges</TableCell>
                    <TableCell align="right">{costBreakdown.hospitalCharges.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Treatment Cost</TableCell>
                    <TableCell align="right">{costBreakdown.treatmentCost.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Total</b></TableCell>
                    <TableCell align="right"><b>{preauth.cost.toLocaleString()}</b></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Insurance Coverage & Payment
          </Typography>
          <Typography><b>Covered by Insurance:</b> ₹{insuranceCoveredAmount.toLocaleString()}</Typography>
          <Typography><b>Amount to be Paid by Patient:</b> ₹{patientPayableAmount.toLocaleString()}</Typography>

          <Divider sx={{ my: 2 }} />

          {/* Download Receipt */}
          <Button
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadReceipt}
            sx={{ mb: 2 }}
          >
            Download Receipt (PDF)
          </Button>

          {/* Upload Files */}
          <Typography variant="h6" gutterBottom>
            Upload Files
          </Typography>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ marginBottom: 16 }}
          />
          <Button
            variant="contained"
            onClick={handleUploadFiles}
            disabled={uploading || !selectedFiles.length}
            sx={{ ml: 2, mb: 2 }}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
          {uploading && <LinearProgress sx={{ mt: 1, mb: 1 }} />}

          {/* Uploaded Files List */}
          {preauth.documents && preauth.documents.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Uploaded Files:
              </Typography>
              <List>
                {preauth.documents.map((file, idx) => (
                  <ListItem
                    key={file.name + idx}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleDownloadUploadedFile(file)}>
                        <DownloadIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={file.name} />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Discharge Summary with dark mode support */}
          <Typography variant="h6" gutterBottom>
            Discharge Summary
          </Typography>
          <Paper
            sx={{
              p: 2,
              bgcolor: theme.palette.mode === "dark" ? "#424242" : "#f5f5f5",
              borderRadius: 1,
            }}
          >
            <Typography
              sx={{
                color: theme.palette.mode === "dark" ? "#fff" : "text.primary",
              }}
            >
              {dischargeSummary}
            </Typography>
          </Paper>
        </Paper>
      )}
    </Box>
  );
};

export default GenerateBills;
