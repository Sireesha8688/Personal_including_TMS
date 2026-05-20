import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import HospitalQueryAccordian from "./ClaimAdjudicationUtils/HospitalQueryAccordian";
import HospitalClaimRaised from "./ClaimAdjudicationUtils/HospitalClaimRaised";
import axios from "axios";
import HospitalAssignedForVerifier from "./ClaimAdjudicationUtils/HospitalAssignedForVerifier";
import HospitalDeniedAccordian from "./ClaimAdjudicationUtils/hospitalDeniedAccordian";
import HospitalApproveAccordian from "./ClaimAdjudicationUtils/HospitalApproveAccordian";

const STATUS_FLOW = {
  CLAIM_RAISED: "Claim Raised",
  CLAIM_ASSIGNED_FOR_QUERY: "Insurer Query Review",
  CLAIM_ASSIGNED_FOR_VERIFIER_REVIEW: "Verifier Review",
  CLAIM_DENIED: "Denied",
  CLAIM_APPROVED: "Approved",
};

const statusChipColor = (status) => {
  switch (status) {
    case "Approved":
      return "success";
    case "Denied":
      return "error";
    case "Verifier Review":
    case "Insurer Query Review":
      return "warning";
    case "Claim Raised":
      return "info";
    default:
      return "info";
  }
};

const InsurerHospitalClaimCard = ({ claim }) => {
  const API_ENDPOINT = `http://localhost:9090`;

  const [statusChange, setStatusChange] = useState(
    STATUS_FLOW[claim.insurerStatus] || STATUS_FLOW.CLAIM_RAISED
  );
  const [status, setStatus] = useState(
    STATUS_FLOW[claim.insurerStatus] || STATUS_FLOW.CLAIM_RAISED
  );
  const [statusDisabled, setStatusDisabled] = useState(true);
  const handleSelectStatus = () => {
    setStatus(statusChange);
    setStatusDisabled(true);
  };
  const handleEditStatus = () => {
    setStatusDisabled(false);
  };

  const [claimRaisedAccordion, setClaimRaisedAccordion] = useState(false);
  const [claimQueriedAccordion, setClaimQueriedAccordion] = useState(false);
  const [
    claimAssignedForVerifierAccordion,
    setClaimAssignedForVerifierAccordion,
  ] = useState(false);
  const [claimDeniedAccordian, setClaimDeniedAccordian] = useState(false);
  const [claimApprovedAccordian, setClaimApprovedAccordian] = useState(false);

  const [hospitalName, setHospitalName] = useState(null);
  const [claimTypeName, setClaimTypeName] = useState("Unknown");

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        if (claim.hospitalId) {
          const response = await axios.get(
            `${API_ENDPOINT}/hospitals/${claim.hospitalId}`
          );
          setHospitalName(
            response.data?.name || `ID: ${claim.hospitalId} (Name Not Found)`
          );
        } else {
          setHospitalName("N/A (No Hospital ID)");
        }
      } catch (err) {
        console.error("Error fetching hospital name:", err);
        setHospitalName(`Error fetching hospital (ID: ${claim.hospitalId})`);
      }

      if (!claim.claimTypeId || claim.claimTypeId === "null") {
        setClaimTypeName("Not specified");
        return;
      }
      try {
        const res = await axios.get(
          `${API_ENDPOINT}/claimTypes/${claim.claimTypeId}`
        );
        setClaimTypeName(res.data?.type || "Unknown");
      } catch (error) {
        console.error("Error fetching claim type:", error);
        setClaimTypeName("Unknown");
      }
    };

    if (claim?.hospitalId || claim?.claimTypeId) {
      fetchRelatedData();
    } else {
      setHospitalName("N/A (No Hospital ID)");
      setClaimTypeName("Not specified");
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      setClaimRaisedAccordion(false);
      setClaimQueriedAccordion(false);
      setClaimAssignedForVerifierAccordion(false);
      setClaimDeniedAccordian(false);
      setClaimApprovedAccordian(false);
      try {
        switch (status) {
          case STATUS_FLOW.CLAIM_RAISED:
            {
              setClaimRaisedAccordion(true);
              console.log("Loading initial claim details for CLAIM_RAISED...");
            }
            break;
          case STATUS_FLOW.CLAIM_ASSIGNED_FOR_QUERY:
            {
              setClaimQueriedAccordion(true);
              console.log("Loading query details for Insurer Query Review...");
            }
            break;
          case STATUS_FLOW.CLAIM_ASSIGNED_FOR_VERIFIER_REVIEW:
            {
              setClaimAssignedForVerifierAccordion(true);
              console.log("Loading verifier review data...");
            }
            break;
          case STATUS_FLOW.CLAIM_DENIED:
            {
              setClaimDeniedAccordian(true);
              console.log("Loading denial reasons and history...");
            }
            break;
          case STATUS_FLOW.CLAIM_APPROVED:
            {
              setClaimApprovedAccordian(true);
              console.log("Loading approval details and payout information...");
            }
            break;
          default:
            console.log("Unknown status, loading general claim data.");
            break;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("Data fetching complete.");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [status]);

  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        borderRadius: "8px",
        margin: "15px",
      }}
      elevation={3}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Claim ID: {claim.id}
          </Typography>
          <Chip
            label={status}
            color={statusChipColor(status)}
            sx={{
              fontWeight: 700,
              fontSize: 16,
              px: 2,
              py: 0.5,
              borderRadius: 2,
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Hospital:</strong> {hospitalName} &nbsp;|&nbsp;
          <strong>Customer:</strong> {claim.customerName} &nbsp;|&nbsp;
          <strong>Aadhar:</strong> {claim.customerAadharNumber}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Treatment:</strong> {claim.treatmentOffered || "N/A"}{" "}
          &nbsp;|&nbsp;
          <strong>Cost:</strong> ₹{claim.costOfTreatment}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Claim Type:</strong> {claimTypeName}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Status:{" "}
          <Select
            value={statusChange}
            onChange={(e) => setStatusChange(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
            disabled={statusDisabled}
          >
            {Object.values(STATUS_FLOW).map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={handleSelectStatus} disabled={statusDisabled}>
            Select
          </Button>
          <Button onClick={handleEditStatus} disabled={!statusDisabled}>
            Edit
          </Button>
        </Typography>
        <Divider sx={{ my: 2 }} />
        {claimRaisedAccordion && <HospitalClaimRaised claim={claim} />}
        {claimQueriedAccordion && <HospitalQueryAccordian claim={claim} />}
        {claimAssignedForVerifierAccordion && (
          <HospitalAssignedForVerifier claim={claim} />
        )}
        {claimDeniedAccordian && <HospitalDeniedAccordian claim={claim} />}
        {claimApprovedAccordian && <HospitalApproveAccordian claim={claim} />}
      </CardContent>
    </Card>
  );
};

export default InsurerHospitalClaimCard;
