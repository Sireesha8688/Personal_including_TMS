import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, TextField, Button, CircularProgress, MenuItem, List, ListItem, ListItemText,
  Card, CardContent, Collapse, Tabs, Tab, InputAdornment, useTheme, Snackbar, Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Status styles and labels
const statusStyles = (theme) => ({
  pending:   { background: "#FFA726", color: "#222", label: "PENDING" },
  approved:  { background: "#43A047", color: "#fff", label: "APPROVED" },
  rejected:  { background: "#E53935", color: "#fff", label: "REJECTED" },
});
const statusList = ["pending", "approved", "rejected"];

const VerifierClaimReimbursements = ({ id }) => {
  const theme = useTheme();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingClaimId, setSavingClaimId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [expandedMap, setExpandedMap] = useState({});
  const [search, setSearch] = useState("");
  const [localEdits, setLocalEdits] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const s = statusStyles(theme);

  // Fetch claims on mount or id change
  useEffect(() => {
    if (!id) { setError("Verifier ID not provided."); setLoading(false); return; }
    (async () => {
      try {
        setLoading(true); setError("");
        const res = await axios.get("http://localhost:9090/customerclaims");
        const vId = String(id);
        setClaims(res.data
          .filter(claim => claim && claim.verifierAssigned && String(claim.verifierId) === vId)
          .map(claim => ({
            ...claim,
            verifierComments: claim.verifierComments || "",
            verifierStatus: claim.verifierStatus || "pending",
          }))
        );
        setLocalEdits({});
        setExpandedMap({});
      } catch (e) { setError("Failed to fetch claims."); }
      finally { setLoading(false); }
    })();
  }, [id]);

  // Adjust status filter if searching for a claim in a different status
  useEffect(() => {
    if (search) {
      const found = claims.find(c => String(c.id).toLowerCase().includes(search.toLowerCase()));
      if (found && statusFilter !== (found.verifierStatus || "pending")) {
        setStatusFilter(found.verifierStatus || "pending");
      }
    }
    // eslint-disable-next-line
  }, [search, claims]);

  // Handle local edits
  const handleEdit = (claimId, field, value) => {
    setLocalEdits(prev => ({
      ...prev,
      [claimId]: { ...prev[claimId], [field]: value }
    }));
  };

  // Save claim changes
  const handleSave = async (claim) => {
    setSavingClaimId(claim.id);
    try {
      const { data: existingClaim } = await axios.get(`http://localhost:9090/customerclaims/${claim.id}`);
      const pendingEdit = localEdits[claim.id] || {};
      const newStatus = pendingEdit.verifierStatus ?? claim.verifierStatus;
      const updatedClaim = {
        ...existingClaim,
        verifierComments: pendingEdit.verifierComments ?? claim.verifierComments,
        verifierStatus: newStatus,
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      };
      await axios.patch(`http://localhost:9090/customerclaims/${claim.id}`, updatedClaim);

      setClaims(prev =>
        prev.map(c =>
          c.id === claim.id
            ? { ...c, verifierComments: updatedClaim.verifierComments, verifierStatus: updatedClaim.verifierStatus }
            : c
        )
      );
      setLocalEdits(prev => {
        const copy = { ...prev }; delete copy[claim.id]; return copy;
      });
      setExpandedMap(prev => ({ ...prev, [claim.id]: false }));
      setSnackbar({ open: true, message: "Claim saved successfully!", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to save claim updates.", severity: "error" });
    } finally {
      setSavingClaimId(null);
    }
  };

  // Expand/collapse claim card
  const handleExpand = (claimId) => {
    setExpandedMap(prev => ({ ...prev, [claimId]: !prev[claimId] }));
  };

  // Open base64 PDF or image in new tab
  const openBase64File = (base64, fileName) => {
    let mimeType = "application/octet-stream";
    if (fileName.toLowerCase().endsWith(".pdf")) mimeType = "application/pdf";
    else if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg")) mimeType = "image/jpeg";
    else if (fileName.toLowerCase().endsWith(".png")) mimeType = "image/png";
    const url = base64.startsWith("data:") ? base64 : `data:${mimeType};base64,${base64}`;
    const win = window.open();
    if (win) {
      win.document.write(
        `<iframe src="${url}" frameborder="0" style="border:0; width:100vw; height:100vh;" allowfullscreen></iframe>`
      );
    } else {
      setSnackbar({ open: true, message: "Popup blocked! Please allow popups.", severity: "error" });
    }
  };

  // Render documents section
  const renderDocuments = (documents) => {
    if (!documents) return null;
    const sections = [
      { label: "Hospital Reports", key: "hospitalReports" },
      { label: "Pre-Approval Letters", key: "preApprovalLetter" },
      { label: "Hospital Bills", key: "hospitalBills" }
    ];
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Documents</Typography>
        {sections.map(section =>
          documents[section.key] && documents[section.key].length > 0 ? (
            <Box key={section.key} sx={{ mb: 1 }}>
              <Typography variant="subtitle2">{section.label}:</Typography>
              <List dense>
                {documents[section.key].map((doc, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={
                        doc.fileUrl ? (
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() => openBase64File(doc.fileUrl, doc.fileName)}
                            sx={{ textTransform: "none" }}
                          >
                            {doc.fileName}
                          </Button>
                        ) : (
                          doc.fileName
                        )
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : null
        )}
      </Box>
    );
  };

  // Filtering logic -- only use SAVED status for tab filtering
  const filteredClaims = claims.filter(claim => {
    return (search
      ? String(claim.id).toLowerCase().includes(search.toLowerCase())
      : claim.verifierStatus === statusFilter
    );
  });

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh", py: 4 }}>
      <Box maxWidth="1200px" mx="auto">
        {/* Header & Search */}
        <Box
          sx={{
            mb: 3, px: { xs: 1, sm: 3 }, py: 2,
            bgcolor: theme.palette.mode === "dark" ? "#23272f" : "#f8fafc",
            borderRadius: 3, boxShadow: 2,
            display: "flex", flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between", gap: 2,
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
            onChange={e => setSearch(e.target.value)}
            sx={{
              minWidth: 240,
              bgcolor: theme.palette.mode === "dark" ? "#2c313a" : "#f1f3f6",
              borderRadius: 1,
              input: { color: theme.palette.text.primary }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              style: { color: theme.palette.text.primary }
            }}
            InputLabelProps={{
              style: { color: theme.palette.text.primary }
            }}
          />
        </Box>
        {/* Tabs for status filtering */}
        <Tabs
          value={statusFilter}
          onChange={(e, v) => setStatusFilter(v)}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            mb: 3, px: { xs: 1, sm: 3 },
            ".MuiTabs-flexContainer": { justifyContent: { xs: "center", sm: "flex-start" } },
          }}
        >
          {statusList.map(status => (
            <Tab
              key={status}
              label={
                <Box
                  sx={{
                    px: 2, py: 0.5, borderRadius: 2,
                    bgcolor: s[status].background,
                    color: s[status].color,
                    fontWeight: 700, fontSize: 16,
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
        {/* Loading/Error/No Data/Claims */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Box sx={{ color: theme.palette.error.main, textAlign: "center", mt: 4 }}>
            {error}
          </Box>
        ) : filteredClaims.length === 0 ? (
          <Box sx={{ color: theme.palette.text.primary, textAlign: "center", mt: 4 }}>
            No claims found{search && " for this search"}.
          </Box>
        ) : (
          filteredClaims.map(claim => {
            const isExpanded = !!expandedMap[claim.id];
            const pendingEdit = localEdits[claim.id] || {};
            // Use local edit for dropdown and comments, but not for tab filtering
            return (
              <Card
                key={claim.id}
                sx={{
                  mb: 4, borderRadius: 4,
                  boxShadow: theme.palette.mode === "dark"
                    ? "0 2px 16px 0 rgba(0,0,0,0.32)"
                    : "0 2px 16px 0 rgba(60,72,100,0.08)",
                  width: "100%", maxWidth: "100%",
                  bgcolor: theme.palette.mode === "dark" ? "#23272f" : "#fff",
                  color: theme.palette.text.primary,
                  minHeight: 120, px: { xs: 2, sm: 6 }, py: 3, position: "relative",
                  transition: "box-shadow 0.2s",
                }}
              >
                <Box sx={{
                  position: "absolute", top: 24, right: 40, zIndex: 1,
                }}>
                  <Box sx={{
                    px: 2, py: 0.5, borderRadius: 2,
                    bgcolor: s[pendingEdit.verifierStatus ?? claim.verifierStatus].background,
                    color: s[pendingEdit.verifierStatus ?? claim.verifierStatus].color,
                    fontWeight: 700, fontSize: 16, boxShadow: 1,
                  }}>
                    {s[pendingEdit.verifierStatus ?? claim.verifierStatus].label}
                  </Box>
                </Box>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 1, pb: 0 }}>
                  <Typography variant="h6" fontWeight={700}>
                    Claim ID: {claim.id}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Customer ID:</strong> {claim.customerId}</Typography>
                  <Typography variant="body1">
                    <strong>Claim Type ID:</strong> {claim.claimTypeId}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Cost of Treatment:</strong> {claim.costOfTreatment ? `₹${claim.costOfTreatment}` : "-"}
                  </Typography>
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2 }}>
                      {renderDocuments(claim.documents)}
                      <Box sx={{ mt: 3 }}>
                        <TextField
                          label="Verifier Comments"
                          multiline rows={3} fullWidth
                          value={pendingEdit.verifierComments ?? claim.verifierComments}
                          onChange={e => handleEdit(claim.id, "verifierComments", e.target.value)}
                          disabled={savingClaimId === claim.id}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          select label="Verifier Status"
                          value={pendingEdit.verifierStatus ?? claim.verifierStatus}
                          onChange={e => handleEdit(claim.id, "verifierStatus", e.target.value)}
                          disabled={savingClaimId === claim.id}
                          fullWidth sx={{ mb: 2 }}
                        >
                          {statusList.map(status => (
                            <MenuItem key={status} value={status}>
                              {s[status].label}
                            </MenuItem>
                          ))}
                        </TextField>
                        <Box sx={{ mt: 3, textAlign: "right" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={e => { e.stopPropagation(); handleSave(claim); }}
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
      </Box>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VerifierClaimReimbursements;
