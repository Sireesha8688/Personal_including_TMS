import React, { useState } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  useTheme,
} from "@mui/material";

const RespondQuery = () => {
  const theme = useTheme();

  const initialQueries = [
    {
      id: 1,
      patientId: "a52a",
      subject: "Claim status update",
      message: "When will my claim be processed?",
      status: "open",
    },
    {
      id: 2,
      patientId: "b73b",
      subject: "Document submission",
      message: "I have submitted all documents, please confirm.",
      status: "closed",
      reply: "Documents received and verified.",
    },
    {
      id: 3,
      patientId: "c84c",
      subject: "Policy coverage query",
      message: "Does my policy cover this treatment?",
      status: "open",
    },
  ];

  const [queries, setQueries] = useState(initialQueries);
  const [replyText, setReplyText] = useState("");
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);

  const handleOpenReplyDialog = (query) => {
    setSelectedQuery(query);
    setReplyDialogOpen(true);
  };

  const handleCloseReplyDialog = () => {
    setReplyDialogOpen(false);
    setSelectedQuery(null);
    setReplyText("");
  };

  const handleSendReply = () => {
    if (selectedQuery && replyText.trim()) {
      setQueries((prevQueries) =>
        prevQueries.map((q) =>
          q.id === selectedQuery.id
            ? { ...q, status: "closed", reply: replyText.trim() }
            : q
        )
      );
      handleCloseReplyDialog();
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mt: 4, mb: 2, color: "primary.main" }}>
        Respond Claim Query (Queries Pending:{" "}
        {queries.filter((q) => q.status === "open").length})
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          bgcolor:
            theme.palette.mode === "dark"
              ? "#303030"
              : "background.paper",
          color:
            theme.palette.mode === "dark"
              ? "#fff"
              : "text.primary",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "#424242"
                    : "grey.100",
              }}
            >
              <TableCell>Patient ID</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((q) => (
              <TableRow
                key={q.id}
                sx={{
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "#424242"
                      : "inherit",
                }}
              >
                <TableCell>{q.patientId}</TableCell>
                <TableCell>{q.subject}</TableCell>
                <TableCell>{q.message}</TableCell>
                <TableCell>
                  <Chip
                    label={q.status}
                    color={q.status === "open" ? "warning" : "success"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {q.status === "open" ? (
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenReplyDialog(q)}
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? "#fff"
                            : "inherit",
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "#fff"
                            : "inherit",
                        "&:hover": {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "#bbb"
                              : "inherit",
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.08)"
                              : "inherit",
                        },
                      }}
                    >
                      Reply
                    </Button>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Replied
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {queries.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No queries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={replyDialogOpen}
        onClose={handleCloseReplyDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor:
              theme.palette.mode === "dark"
                ? "#424242"
                : "background.paper",
            color:
              theme.palette.mode === "dark"
                ? "#fff"
                : "text.primary",
          },
        }}
      >
        <DialogTitle>Reply to Query</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            autoFocus
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? "#616161"
                  : "background.paper",
              color:
                theme.palette.mode === "dark"
                  ? "#fff"
                  : "text.primary",
              mt: 1,
            }}
            InputProps={{
              style: {
                color:
                  theme.palette.mode === "dark"
                    ? "#fff"
                    : "inherit",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReplyDialog}>Cancel</Button>
          <Button
            onClick={handleSendReply}
            color="primary"
            variant="contained"
            disabled={!replyText.trim()}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RespondQuery;
