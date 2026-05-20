import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, TextField, Button, CircularProgress, MenuItem, List, ListItem, ListItemText,
  IconButton, Card, CardContent, Collapse, Tabs, Tab, InputAdornment, useTheme, Snackbar, Alert
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const statusStyles = (theme) => ({
  pending: { background: "#FFA726", color: "#222", label: "PENDING" },
  approved: { background: "#43A047", color: "#fff", label: "APPROVED" },
  rejected: { background: "#E53935", color: "#fff", label: "REJECTED" },
});
const statusList = ["pending", "approved", "rejected"];

const VerifierClaims = ({ id }) => {
  const theme = useTheme();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingClaimId, setSavingClaimId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [expandedMap, setExpandedMap] = useState({});
  const [search, setSearch] = useState("");
  const [localEdits, setLocalEdits] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, severity: "info", message: "" });
  const s = statusStyles(theme);

  useEffect(() => {
    if (!id) {
      setError("Verifier ID not provided.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("http://localhost:9090/hospitalclaims");
        const vId = String(id);
        setClaims(
          res.data
            .filter(
              (claim) =>
                claim &&
                claim.verifierAssigned &&
                String(claim.verifierId) === vId
            )
            .map((claim) => ({
              ...claim,
              verifierComments: claim.verifierComments || "",
              verifierStatus: claim.verifierStatus || "pending",
              verifierDocuments: Array.isArray(claim.verifierDocuments)
                ? claim.verifierDocuments
                : [],
              newDocuments: [],
            }))
        );
        setLocalEdits({});
        setExpandedMap({});
      } catch (e) {
        setError("Failed to fetch claims.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (search) {
      const found = claims.find((c) =>
        String(c.id).toLowerCase().includes(search.toLowerCase())
      );
      if (found && statusFilter !== found.verifierStatus) {
        setStatusFilter(found.verifierStatus);
      }
    }
    // eslint-disable-next-line
  }, [search, claims]);

  const searchedClaims = search
    ? claims.filter((c) =>
      String(c.id).toLowerCase().includes(search.toLowerCase())
    )
    : claims.filter((c) => c.verifierStatus === statusFilter);

  const handleEdit = (claimId, field, value) => {
    setLocalEdits((prev) => ({
      ...prev,
      [claimId]: { ...prev[claimId], [field]: value },
    }));
  };

  // Convert file to Base64 and store in newDocuments as { fileName, fileUrl }
  const handleFileUpload = async (claimId, files) => {
    for (const file of files) {
      const isDup = claims.some(
        (claim) =>
          claim.id === claimId &&
          (claim.verifierDocuments?.some((doc) => doc.fileName === file.name) ||
            claim.newDocuments?.some((doc) => doc.fileName === file.name))
      );
      if (isDup) {
        setSnackbar({
          open: true,
          severity: "warning",
          message: `File "${file.name}" already uploaded.`,
        });
        continue;
      }

      // Convert to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      const uploadedFile = { fileName: file.name, fileUrl: base64 };
      setClaims((prev) =>
        prev.map((claim) =>
          claim.id === claimId
            ? { ...claim, newDocuments: [...(claim.newDocuments || []), uploadedFile] }
            : claim
        )
      );
    }
  };

  const handleRemoveNewDocument = (claimId, index) => {
    setClaims((prev) =>
      prev.map((claim) => {
        if (claim.id === claimId) {
          const newDocs = [...(claim.newDocuments || [])];
          newDocs.splice(index, 1);
          return { ...claim, newDocuments: newDocs };
        }
        return claim;
      })
    );
  };

  const handleRemoveExistingDocument = (claimId, index) => {
    setClaims((prev) =>
      prev.map((claim) => {
        if (claim.id === claimId) {
          const docs = [...(claim.verifierDocuments || [])];
          docs.splice(index, 1);
          return { ...claim, verifierDocuments: docs };
        }
        return claim;
      })
    );
  };

  const handleSave = async (claim) => {
    setSavingClaimId(claim.id);
    try {
      const { data: existingClaim } = await axios.get(
        `http://localhost:9090/hospitalclaims/${claim.id}`
      );
      // Merge existing and new documents
      const allDocs = [...(claim.verifierDocuments || []), ...(claim.newDocuments || [])];
      const pendingEdit = localEdits[claim.id] || {};
      const updatedClaim = {
        ...existingClaim,
        verifierComments: pendingEdit.verifierComments ?? claim.verifierComments,
        verifierStatus: pendingEdit.verifierStatus ?? claim.verifierStatus,
        verifierDocuments: allDocs,
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      };
      await axios.patch(`http://localhost:9090/hospitalclaims/${claim.id}`, updatedClaim);
      setClaims((prev) =>
        prev.map((c) =>
          c.id === claim.id
            ? {
              ...c,
              verifierComments: updatedClaim.verifierComments,
              verifierStatus: updatedClaim.verifierStatus,
              verifierDocuments: allDocs,
              newDocuments: [],
            }
            : c
        )
      );
      setLocalEdits((prev) => {
        const copy = { ...prev };
        delete copy[claim.id];
        return copy;
      });
      setExpandedMap((prev) => ({ ...prev, [claim.id]: false })); // collapse after save

      setSnackbar({ open: true, severity: "success", message: "Claim saved successfully" });
    } catch {
      setSnackbar({ open: true, severity: "error", message: "Failed to save claim updates." });
    } finally {
      setSavingClaimId(null);
    }
  };

  const handleExpand = (claimId) => {
    setExpandedMap((prev) => ({ ...prev, [claimId]: !prev[claimId] }));
  };

  // Open base64 file in new tab
  const handleOpenBase64 = (fileName, fileUrl) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(
        `<iframe src="${fileUrl}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`
      );
      newWindow.document.title = fileName;
    } else {
      setSnackbar({ open: true, severity: "warning", message: "Popup blocked! Please allow popups for this site." });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh", py: 4 }}>
      <Box maxWidth="1200px" mx="auto">
        {/* Header & Search */}
        <Box
          sx={{
            mb: 3,
            px: { xs: 1, sm: 3 },
            py: 2,
            bgcolor: theme.palette.mode === "dark" ? "#23272f" : "#f8fafc",
            borderRadius: 3,
            boxShadow: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            Claims - {s[statusFilter].label}
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by Claim ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              minWidth: 240,
              bgcolor: theme.palette.mode === "dark" ? "#2c313a" : "#f1f3f6",
              borderRadius: 1,
              input: { color: theme.palette.text.primary },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              style: { color: theme.palette.text.primary },
            }}
            InputLabelProps={{
              style: { color: theme.palette.text.primary },
            }}
          />
        </Box>
        {/* Status Tabs */}
        <Tabs
          value={statusFilter}
          onChange={(e, v) => setStatusFilter(v)}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            mb: 3,
            px: { xs: 1, sm: 3 },
            ".MuiTabs-flexContainer": { justifyContent: { xs: "center", sm: "flex-start" } },
          }}
        >
          {statusList.map((status) => (
            <Tab
              key={status}
              label={
                <Box
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: s[status].background,
                    color: s[status].color,
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {s[status].label}
                </Box>
              }
              value={status}
              sx={{ minWidth: 140 }}
            />
          ))}
        </Tabs>

        {/* Loading/Error/Empty States */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Box sx={{ color: theme.palette.error.main, textAlign: "center", mt: 4 }}>
            {error}
          </Box>
        ) : searchedClaims.length === 0 ? (
          <Box sx={{ color: theme.palette.text.primary, textAlign: "center", mt: 4 }}>
            No claims found{search && " for this search"}.
          </Box>
        ) : (
          searchedClaims.map((claim) => {
            const isExpanded = !!expandedMap[claim.id];
            const pendingEdit = localEdits[claim.id] || {};
            return (
              <Card
                key={claim.id}
                sx={{
                  mb: 4,
                  borderRadius: 4,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 2px 16px 0 rgba(0,0,0,0.32)"
                      : "0 2px 16px 0 rgba(60,72,100,0.08)",
                  width: "100%",
                  maxWidth: "100%",
                  bgcolor: theme.palette.mode === "dark" ? "#23272f" : "#fff",
                  color: theme.palette.text.primary,
                  minHeight: 120,
                  px: { xs: 2, sm: 6 },
                  py: 3,
                  position: "relative",
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Status Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 24,
                    right: 40,
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      bgcolor: s[pendingEdit.verifierStatus ?? claim.verifierStatus].background,
                      color: s[pendingEdit.verifierStatus ?? claim.verifierStatus].color,
                      fontWeight: 700,
                      fontSize: 16,
                      boxShadow: 1,
                    }}
                  >
                    {s[pendingEdit.verifierStatus ?? claim.verifierStatus].label}
                  </Box>
                </Box>

                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 1, pb: 0 }}>
                  <Typography variant="h6" fontWeight={700}>
                    Claim ID: {claim.id}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Hospital ID:</strong> {claim.hospitalId}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Customer Aadhar:</strong> {claim.customerAadharNumber}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Treatment:</strong> {claim.treatmentOffered}
                  </Typography>

                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Admission Details
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Is Admitted:</strong>{" "}
                        {claim.treatmentDetails?.isAdmitted ? "Yes" : "No"}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Date of Admission:</strong>{" "}
                        {claim.treatmentDetails?.dateOfAdmission || "-"}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Admission Notes:</strong>{" "}
                        {claim.treatmentDetails?.admissionNotes || "-"}
                      </Typography>

                      {/* Verifier Documents */}
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Verifier Documents:
                        </Typography>
                        <List dense>
                          {claim.verifierDocuments.map((doc, idx) => (
                            <ListItem
                              key={idx}
                              secondaryAction={
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveExistingDocument(claim.id, idx);
                                  }}
                                  disabled={savingClaimId === claim.id}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              }
                            >
                              <ListItemText
                                primary={
                                  <Button
                                    variant="text"
                                    onClick={() => handleOpenBase64(doc.fileName, doc.fileUrl)}
                                    color="primary"
                                  >
                                    {doc.fileName}
                                  </Button>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>

                        {/* New uploaded files (not saved yet) */}
                        {claim.newDocuments.length > 0 && (
                          <>
                            <Typography variant="subtitle2" gutterBottom>
                              New Documents:
                            </Typography>
                            <List dense>
                              {claim.newDocuments.map((doc, idx) => (
                                <ListItem
                                  key={idx}
                                  secondaryAction={
                                    <IconButton
                                      edge="end"
                                      aria-label="delete"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveNewDocument(claim.id, idx);
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  }
                                >
                                  <ListItemText
                                    primary={
                                      <Button
                                        variant="text"
                                        onClick={() => handleOpenBase64(doc.fileName, doc.fileUrl)}
                                        color="primary"
                                      >
                                        {doc.fileName}
                                      </Button>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </>
                        )}

                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<UploadFileIcon />}
                          disabled={savingClaimId === claim.id}
                          sx={{ mb: 2, mt: 2 }}
                        >
                          Upload Documents
                          <input
                            hidden
                            multiple
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => handleFileUpload(claim.id, e.target.files)}
                          />
                        </Button>
                      </Box>

                      {/* Verifier Comments and Status */}
                      <Box sx={{ mt: 3 }}>
                        <TextField
                          label="Verifier Comments"
                          multiline
                          rows={3}
                          fullWidth
                          value={pendingEdit.verifierComments ?? claim.verifierComments}
                          onChange={(e) =>
                            handleEdit(claim.id, "verifierComments", e.target.value)
                          }
                          disabled={savingClaimId === claim.id}
                          sx={{ mb: 2 }}
                        /> <TextField
                          select
                          label="Verifier Status"
                          value={pendingEdit.verifierStatus ?? claim.verifierStatus}
                          onChange={(e) =>
                            handleEdit(claim.id, "verifierStatus", e.target.value)
                          }
                          disabled={savingClaimId === claim.id}
                          fullWidth
                          sx={{ mb: 2 }}
                        >
                          {statusList.map((status) => (
                            <MenuItem key={status} value={status}>
                              {s[status].label}
                            </MenuItem>
                          ))}
                        </TextField>
                        <Box sx={{ mt: 3, textAlign: "right" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSave(claim);
                            }}
                            disabled={savingClaimId === claim.id}
                          >
                            {savingClaimId === claim.id ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>

                  {/* Actions button */}
                  {!isExpanded && (
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => handleExpand(claim.id)}
                        endIcon={<ExpandMoreIcon />}
                      >
                        Actions
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default VerifierClaims;
