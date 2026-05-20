import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Paper,
} from "@mui/material";
import {
  Receipt,
  GppGood,
  CheckCircle,
  Payment,
  CancelOutlined,
  Warning,
} from "@mui/icons-material";

const statusSteps = [
  { label: "Pending", icon: <Receipt /> },
  { label: "Approved", icon: <GppGood /> },
  { label: "Admitted", icon: <CheckCircle /> },
  { label: "Completed", icon: <Payment /> },
  { label: "Cancelled", icon: <CancelOutlined /> },
  { label: "Emergency", icon: <Warning /> },
];

const getStatusStep = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return 0;
    case "approved":
      return 1;
    case "admitted":
      return 2;
    case "paid":
    case "completed":
      return 3;
    case "cancelled":
    case "denied":
      return 4;
    case "emergency":
      return 5;
    default:
      return 0;
  }
};

const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "default";
    case "approved":
      return "info";
    case "admitted":
      return "primary";
    case "paid":
    case "completed":
      return "success";
    case "cancelled":
    case "denied":
      return "error";
    case "emergency":
      return "warning";
    default:
      return "default";
  }
};

const TrackClaimStatus = ({ preauths }) => {
  const [searchPatientId, setSearchPatientId] = useState("");

  const filteredPreauths = useMemo(() => {
    if (searchPatientId.trim() === "") {
      return preauths.slice(0, 3);
    }
    return preauths.filter((p) =>
      p.id?.toString().includes(searchPatientId.trim())
    );
  }, [preauths, searchPatientId]);

  const claimsInProcessCount = preauths.filter(
    (c) =>
      c.status?.toLowerCase() !== "paid" &&
      c.status?.toLowerCase() !== "completed" &&
      c.status?.toLowerCase() !== "cancelled" &&
      c.status?.toLowerCase() !== "denied"
  ).length;

  return (
    <Box>
      <Typography variant="h5" sx={{ mt: 4, mb: 2, color: "primary.main" }}>
        Track Claim Status (Claims in Process: {claimsInProcessCount})
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          label="Search by Patient ID"
          variant="outlined"
          value={searchPatientId}
          onChange={(e) => setSearchPatientId(e.target.value)}
          fullWidth
          type="text"
        />
      </Paper>

      <Grid container spacing={2}>
        {filteredPreauths.length === 0 ? (
          <Typography sx={{ m: 2 }}>No claims found.</Typography>
        ) : (
          filteredPreauths.map((claim) => (
            <Grid item xs={12} md={6} key={claim.id}>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar>
                      {claim.id?.toString().charAt(0) || "E"}
                    </Avatar>
                  }
                  title={`Patient ID: ${claim.id}`}
                  subheader={
                    <>
                      <Typography variant="body2">
                        Customer ID: {claim.customerId}
                      </Typography>
                      <Typography variant="body2">
                        Policy IDs: {claim.policyIds?.join(", ") || "No policies found"}
                      </Typography>
                      <Typography variant="body2">
                        Treatment: {claim.treatment}
                      </Typography>
                      <Typography variant="body2">
                        Cost: ₹{claim.cost}
                      </Typography>
                      <Typography variant="body2">Date: {claim.date}</Typography>
                    </>
                  }
                  action={
                    <Chip
                      label={
                        claim.status
                          ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1)
                          : "Pending"
                      }
                      color={statusColor(claim.status)}
                      variant="outlined"
                      sx={{ ml: 2 }}
                    />
                  }
                />
                <CardContent>
                  <Stepper activeStep={getStatusStep(claim.status)} alternativeLabel>
                    {statusSteps.map((step, index) => (
                      <Step key={step.label}>
                        <StepLabel
                          StepIconComponent={() => (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                bgcolor:
                                  index === getStatusStep(claim.status)
                                    ? statusColor(claim.status) + ".main"
                                    : "action.disabledBackground",
                                color:
                                  index === getStatusStep(claim.status)
                                    ? "common.white"
                                    : "text.secondary",
                              }}
                            >
                              {step.icon}
                            </Box>
                          )}
                        >
                          {step.label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default TrackClaimStatus;
