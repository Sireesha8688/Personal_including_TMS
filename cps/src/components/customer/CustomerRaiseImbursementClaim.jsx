import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  InputLabel,
  FormControl,
  Select,
  FormHelperText,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const steps = ["Select Claim Type", "Fill Claim Details"];

const API_BASE_URL = "http://localhost:9090";

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const CustomerRaiseImbursementClaim = ({ id: customerId }) => {
  const [activeStep, setActiveStep] = useState(0);

  const [claimTypes, setClaimTypes] = useState([]);
  const [selectedClaimTypeId, setSelectedClaimTypeId] = useState("");
  const [costOfTreatment, setCostOfTreatment] = useState("");
  const [documents, setDocuments] = useState({
    hospitalReports: [], // Multiple PDFs/JPGs
    preApprovalLetter: null, // Single PDF
    hospitalBills: [], // CHANGED: Now multiple PDFs/JPGs
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchClaimTypes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/claimTypes`);
        if (res.data) {
          setClaimTypes(res.data);
        }
      } catch (error) {
        console.error("Error fetching claim types", error);
        setSubmitError("Failed to load claim types. Please refresh.");
      }
    };
    fetchClaimTypes();
  }, []);

  // Handle file change for different document types
  const handleFileChange = async (docType, event) => {
    const files = event.target.files;
    if (!files.length) return;

    setSubmitError(""); // Clear previous file-related errors

    const newFilesData = [];
    let isValidType = true;

    for (const file of Array.from(files)) {
      let acceptedType = false;
      if (docType === "hospitalReports" || docType === "hospitalBills") {
        if (file.type === "application/pdf" || file.type.startsWith("image/")) {
          acceptedType = true;
        } else {
          isValidType = false;
          setSubmitError(
            `${docType === "hospitalReports" ? "Hospital Reports" : "Hospital Bills"} must be PDF or image files.`
          );
          break;
        }
      } else if (docType === "preApprovalLetter") {
        if (file.type === "application/pdf") {
          acceptedType = true;
        } else {
          isValidType = false;
          setSubmitError("Pre-Approval Letter must be a PDF file.");
          break;
        }
      }

      if (acceptedType) {
        try {
          const base64 = await fileToBase64(file);
          newFilesData.push({ fileName: file.name, fileUrl: base64 });
        } catch (error) {
          console.error("Error converting file to base64:", error);
          setSubmitError(`Failed to read file ${file.name}.`);
          isValidType = false;
          break;
        }
      }
    }

    if (!isValidType) return;

    setDocuments((prev) => {
      if (docType === "hospitalReports" || docType === "hospitalBills") {
        return {
          ...prev,
          [docType]: [...prev[docType], ...newFilesData],
        };
      } else {
        // For single file upload, replace the existing one
        return {
          ...prev,
          [docType]: newFilesData.length > 0 ? newFilesData[0] : null,
        };
      }
    });
  };

  const validateStep2 = () => {
    const errors = {};
    if (!selectedClaimTypeId) errors.claimType = "Claim type is required";
    if (!costOfTreatment)
      errors.costOfTreatment = "Cost of treatment is required";
    else if (isNaN(costOfTreatment) || Number(costOfTreatment) <= 0)
      errors.costOfTreatment = "Cost must be a positive number";

    if (documents.hospitalReports.length === 0)
      errors.hospitalReports = "Hospital Reports are required";
    if (!documents.preApprovalLetter)
      errors.preApprovalLetter = "Pre-Approval Letter is required";
    if (documents.hospitalBills.length === 0)
      // CHANGED: Check length for multiple files
      errors.hospitalBills = "Hospital Bills are required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    setSubmitError("");
    setSubmitSuccess("");

    if (activeStep === 0) {
      if (!selectedClaimTypeId) {
        setFormErrors({ claimType: "Please select a claim type" });
        return;
      }
      setFormErrors({});
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (validateStep2()) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    const claimPayload = {
      customerId: customerId,
      claimTypeId: selectedClaimTypeId,
      costOfTreatment: Number(costOfTreatment),
      customerStatus: "CLAIM_RAISED",
      documents: {
        hospitalReports: documents.hospitalReports,
        preApprovalLetter: documents.preApprovalLetter,
        hospitalBills: documents.hospitalBills,
      },
      insurerId: null,
      insurerStatus: null,
      verifierAssigned: false,
      verifierId: null,
      verifierComments: null,
      verifierStatus: false,
      finalClaimSettlement: {
        insurerApprovedAmount: null,
        insurerFinalBill: null,
        insurerMessage: null,
      },
      customerReRaiseClaimMessage: null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    try {
      await axios.post(`${API_BASE_URL}/customerclaims`, claimPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSubmitSuccess("Claim raised successfully!");
      setActiveStep(0);
      setSelectedClaimTypeId("");
      setCostOfTreatment("");
      setDocuments({
        hospitalReports: [],
        preApprovalLetter: null,
        hospitalBills: [], // Reset to empty array
      });
      alert("success submitted claim");
      setFormErrors({});
    } catch (error) {
      console.error("Error raising claim:", error);
      setSubmitError("Failed to raise claim. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100vh",
        width: "100%",
        p: 2,
        boxSizing: "border-box",
        overflowY: "auto",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Raise a Reimbursement Claim
      </Typography>

      <Box sx={{ width: "100%", px: 1, maxWidth: 600 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box sx={{ mt: 3 }}>
            <FormControl
              fullWidth
              error={Boolean(formErrors.claimType)}
              sx={{ mb: 3 }}
            >
              <InputLabel id="claim-type-label">Claim Type</InputLabel>
              <Select
                labelId="claim-type-label"
                value={selectedClaimTypeId}
                label="Claim Type"
                onChange={(e) => setSelectedClaimTypeId(e.target.value)}
              >
                {claimTypes.map((ct) => (
                  <MenuItem key={ct.id} value={ct.id}>
                    {ct.type}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.claimType && (
                <FormHelperText>{formErrors.claimType}</FormHelperText>
              )}
            </FormControl>

            <Box sx={{ textAlign: "right" }}>
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ mt: 3 }}>
            <TextField
              label="Cost of Treatment"
              value={costOfTreatment}
              onChange={(e) => setCostOfTreatment(e.target.value)}
              fullWidth
              type="number"
              error={Boolean(formErrors.costOfTreatment)}
              helperText={formErrors.costOfTreatment}
              sx={{ mb: 3 }}
            />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Upload Documents (All Required)
            </Typography>

            {/* Hospital Reports (Multiple Files, PDF/JPG) */}
            <Box sx={{ mb: 3 }}>
              <InputLabel>Hospital Reports (PDF/JPG, Multiple)</InputLabel>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mt: 1 }}
                startIcon={<CloudUploadIcon />}
              >
                Upload Files
                <input
                  type="file"
                  multiple
                  hidden
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={(e) => handleFileChange("hospitalReports", e)}
                />
              </Button>
              {formErrors.hospitalReports && (
                <Typography color="error" variant="caption" display="block">
                  {formErrors.hospitalReports}
                </Typography>
              )}
              {documents.hospitalReports.length > 0 && (
                <Box mt={1}>
                  {documents.hospitalReports.map((doc, idx) => (
                    <Typography key={idx} variant="body2">
                      {doc.fileName}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>

            {/* Pre-Approval Letter (Single PDF) */}
            <Box sx={{ mb: 3 }}>
              <InputLabel>Pre-Approval Letter (PDF Only)</InputLabel>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mt: 1 }}
                startIcon={<CloudUploadIcon />}
              >
                {documents.preApprovalLetter
                  ? documents.preApprovalLetter.fileName
                  : "Upload File"}
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={(e) => handleFileChange("preApprovalLetter", e)}
                />
              </Button>
              {formErrors.preApprovalLetter && (
                <Typography color="error" variant="caption" display="block">
                  {formErrors.preApprovalLetter}
                </Typography>
              )}
            </Box>

            {/* Hospital Bills (Multiple Files, PDF/JPG) - MODIFIED */}
            <Box sx={{ mb: 3 }}>
              <InputLabel>Hospital Bills (PDF/JPG, Multiple)</InputLabel>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mt: 1 }}
                startIcon={<CloudUploadIcon />}
              >
                Upload Files
                <input
                  type="file"
                  multiple // CHANGED: Added multiple attribute
                  hidden
                  accept="application/pdf,image/jpeg,image/png" // CHANGED: Accept JPG
                  onChange={(e) => handleFileChange("hospitalBills", e)}
                />
              </Button>
              {formErrors.hospitalBills && (
                <Typography color="error" variant="caption" display="block">
                  {formErrors.hospitalBills}
                </Typography>
              )}
              {documents.hospitalBills.length > 0 && ( // CHANGED: Display multiple files
                <Box mt={1}>
                  {documents.hospitalBills.map((doc, idx) => (
                    <Typography key={idx} variant="body2">
                      {doc.fileName}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>

            {submitError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            )}
            {submitSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {submitSuccess}
              </Alert>
            )}

            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                Submit Claim
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CustomerRaiseImbursementClaim;
