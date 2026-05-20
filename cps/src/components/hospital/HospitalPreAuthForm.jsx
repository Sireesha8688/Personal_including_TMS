import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  MenuItem,
  Grid,
  Alert,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

// Base URL for your JSON-server API
const API_BASE_URL = "http://localhost:9090";

const HospitalPreAuthForm = ({ id: hospitalId }) => {
  const [aadharcardNumberInput, setAadharcardNumberInput] = useState("");
  const [customerData, setCustomerData] = useState(null); // Stores fetched customer data
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  const [customerSearchError, setCustomerSearchError] = useState("");

  // State for form fields
  const [treatmentOffered, setTreatmentOffered] = useState("");
  const [claimTypeId, setClaimTypeId] = useState("");
  const [estimatedCostToHospital, setEstimatedCostToHospital] = useState("");

  // State for dropdowns (Claim Types)
  const [claimTypes, setClaimTypes] = useState([]);
  const [claimTypesLoading, setClaimTypesLoading] = useState(true);
  const [claimTypesError, setClaimTypesError] = useState("");

  // State for form submission
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Determine if input fields should be enabled
  const formFieldsEnabled = customerData !== null;

  // Fetch Claim Types on component mount
  useEffect(() => {
    const fetchClaimTypes = async () => {
      try {
        setClaimTypesLoading(true);
        const response = await axios.get(`${API_BASE_URL}/claimTypes`);
        setClaimTypes(response.data);
      } catch (error) {
        console.error("Error fetching claim types:", error);
        setClaimTypesError("Failed to load claim types. Please try again.");
      } finally {
        setClaimTypesLoading(false);
      }
    };
    fetchClaimTypes();
  }, []);

  // Handler for Aadhar card search
  const handleAadharSearch = async () => {
    if (!aadharcardNumberInput) {
      setCustomerSearchError("Please enter Aadhar Card Number.");
      return;
    }
    setCustomerSearchLoading(true);
    setCustomerSearchError("");
    setCustomerData(null); // Clear previous customer data

    try {
      const response = await axios.get(
        `${API_BASE_URL}/customers?aadharcardNumber=${aadharcardNumberInput}`
      );
      if (response.data && response.data.length > 0) {
        setCustomerData(response.data[0]);
        alert("Customer found and details autofilled.");
      } else {
        setCustomerSearchError("Customer not found with this Aadhar number.");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setCustomerSearchError("Error searching for customer. Please try again.");
    } finally {
      setCustomerSearchLoading(false);
    }
  };

  // Handler for clearing customer data and resetting form
  const handleClearCustomer = () => {
    setAadharcardNumberInput("");
    setCustomerData(null);
    setCustomerSearchError("");
    setCustomerSearchLoading(false);
    setTreatmentOffered("");
    setClaimTypeId("");
    setEstimatedCostToHospital("");
    setSubmitSuccess("");
    setSubmitError("");
  };

  // Handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!customerData) {
      setSubmitError("Please search and verify customer first.");
      return;
    }
    if (!treatmentOffered || !claimTypeId || !estimatedCostToHospital) {
      setSubmitError("Please fill all required fields.");
      return;
    }

    setSubmitLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    const newClaim = {
      hospitalId: hospitalId,
      customerName: customerData.name,
      customerAadharNumber: customerData.aadharcardNumber,
      customerId: customerData.id,
      treatmentOffered: treatmentOffered,
      claimTypeId: parseInt(claimTypeId, 10),
      estimatedCostToHospital: parseFloat(estimatedCostToHospital),
      hospitalStatus: "PRE_AUTH_INITIATED",
      insurerId: null,
      insurerStatus: null,
      preAuthorization: {
        responseDateTime: null,
        approvedAmount: null,
        insurerComments: null,
      },
      treatmentDetails: {
        isAdmitted: null,
        dateOfAdmission: null,
        admissionNotes: null,
        isDischarged: null,
        dateOfDischarge: null,
        patientPaidNonMedicalExpenses: null,
        hospitalFinalBill: null,
        hospitalFinalBillAmount: null,
        dischargeSummaryUrl: null,
      },
      verifierAssigned: false,
      verifierId: null,
      verifierComments: null,
      verifierStatus: false,
      finalClaimSettlement: {
        insurerApprovedAmount: null,
        insurerFinalBill: null,
        insurerMessage: null,
      },
      hospitalReRaiseClaimMessage: "",
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    try {
      // JSON-server will auto-generate the 'id' for the new claim
      const response = await axios.post(
        `${API_BASE_URL}/hospitalclaims`,
        newClaim
      );
      setSubmitSuccess(
        `Pre-Authorization Request Submitted! Claim ID: ${response.data.id}`
      );
      alert(
        `Pre-Authorization Request Submitted! Claim ID: ${response.data.id}`
      );

      // Clear form and reset states after successful submission
      handleClearCustomer();
    } catch (error) {
      console.error("Error submitting pre-auth claim:", error);
      setSubmitError("Failed to submit pre-authorization. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Raise Pre-Authorization Request
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Customer Search
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <TextField
            label="Customer Aadhar Card Number"
            variant="outlined"
            fullWidth
            value={aadharcardNumberInput}
            onChange={(e) => setAadharcardNumberInput(e.target.value)}
            disabled={customerSearchLoading || customerData !== null}
            inputProps={{ maxLength: 12 }} // Aadhar numbers are 12 digits
          />
          <Button
            variant="contained"
            onClick={handleAadharSearch}
            disabled={
              customerSearchLoading ||
              customerData !== null ||
              !aadharcardNumberInput
            }
            startIcon={
              customerSearchLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SearchIcon />
              )
            }
          >
            Search
          </Button>
          {customerData && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearCustomer}
              startIcon={<ClearIcon />}
            >
              Clear
            </Button>
          )}
        </Box>
        {customerSearchError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {customerSearchError}
          </Alert>
        )}
        {customerData && (
          <Alert severity="success" sx={{ mt: 1 }}>
            Customer data loaded. Fill in claim details below.
          </Alert>
        )}
      </Paper>

      {customerData && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Customer Details (Auto-filled)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Customer Name"
                value={customerData.name || ""}
                fullWidth
                disabled
                variant="filled" // Use filled to differentiate disabled fields
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Gender"
                value={customerData.gender || ""}
                fullWidth
                disabled
                variant="filled"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Blood Group"
                value={customerData.blood_group || ""}
                fullWidth
                disabled
                variant="filled"
              />
            </Grid>
            {/* You can add more disabled fields here if needed from customerData */}
          </Grid>
        </Paper>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Claim Details
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Treatment Offered"
                variant="outlined"
                fullWidth
                required
                value={treatmentOffered}
                onChange={(e) => setTreatmentOffered(e.target.value)}
                disabled={!formFieldsEnabled}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Claim Type"
                variant="outlined"
                fullWidth
                required
                value={claimTypeId}
                onChange={(e) => setClaimTypeId(e.target.value)}
                disabled={!formFieldsEnabled || claimTypesLoading}
                helperText={claimTypesError || "Please select the claim type"}
              >
                {claimTypesLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} /> Loading...
                  </MenuItem>
                ) : claimTypes.length === 0 ? (
                  <MenuItem disabled>No claim types found</MenuItem>
                ) : (
                  claimTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.type}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Estimated Cost to Hospital"
                variant="outlined"
                fullWidth
                required
                type="number"
                value={estimatedCostToHospital}
                onChange={(e) => setEstimatedCostToHospital(e.target.value)}
                disabled={!formFieldsEnabled}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={
                  !formFieldsEnabled ||
                  submitLoading ||
                  !treatmentOffered ||
                  !claimTypeId ||
                  !estimatedCostToHospital
                }
                startIcon={
                  submitLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
              >
                Submit Pre-Authorization Request
              </Button>
            </Grid>
          </Grid>
        </form>
        {submitSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {submitSuccess}
          </Alert>
        )}
        {submitError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {submitError}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default HospitalPreAuthForm;
