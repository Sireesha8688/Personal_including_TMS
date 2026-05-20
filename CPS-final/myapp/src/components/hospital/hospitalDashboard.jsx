import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  LocalHospital as LocalHospitalIcon,
  AssignmentInd as AssignmentIndIcon,
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  TrackChanges as TrackChangesIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from "@mui/icons-material";
import { styled, ThemeProvider } from "@mui/material/styles";
import { appTheme } from "../../utils/appTheme";
import axios from "axios";

// Import your components
import PreAuth from "./PreAuth";
import AddPatient from "./AddPatient";
import MedicalDischarge from "./MedicalDischarge";
import GenerateBills from "./GenerateBills";
import TrackClaimStatus from "./TrackClaimStatus";
import RespondQuery from "./RespondQuery";
import Dashboard from "./Dashboard";
const drawerWidth = 240;
const miniDrawerWidth = 56;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  width: miniDrawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#1976d2",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      }
    : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      }),
}));

const NAV_ITEMS = [
  { key: "dashboard", text: "Dashboard", icon: <DashboardIcon /> },
  { key: "preauth", text: "Pre-authorization", icon: <LocalHospitalIcon /> },
  { key: "admit", text: "Admit Patients", icon: <AssignmentIndIcon /> },
  { key: "medical", text: "Medical & Discharge", icon: <DescriptionIcon /> },
  { key: "bills", text: "Claim Support", icon: <ReceiptIcon /> },
  { key: "track", text: "Track Claim Status", icon: <TrackChangesIcon /> },
  { key: "response", text: "Respond Claim Query", icon: <QuestionAnswerIcon /> },
];

const HospitalDashboard = () => {
  const [open, setOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedNav, setSelectedNav] = useState("dashboard");
  const [preauths, setPreauths] = useState([]);

  // Access hospitalId passed from login
  const location = useLocation();
  const loggedInHospitalId = location.state?.hospitalId || null;

  const [currentHospital, setCurrentHospital] = useState(null);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      if (loggedInHospitalId) {
        try {
          const res = await axios.get(`http://localhost:9090/hospitals/${loggedInHospitalId}`);
          setCurrentHospital(res.data);
        } catch (err) {
          console.error("Failed to fetch hospital details:", err);
        }
      }
    };

    const fetchPreauths = async () => {
      try {
        const res = await axios.get("http://localhost:9090/preauths");
        setPreauths(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHospitalDetails();
    fetchPreauths();
  }, [loggedInHospitalId]);

  const handlePreauthApprove = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:9090/preauths/${id}`,
        { status: "approved", admissionDetails: { isAdmitted: false } }
      );
      setPreauths((prev) => prev.map((p) => (p.id === id ? res.data : p)));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePreauthCancel = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:9090/preauths/${id}`,
        { status: "cancelled" }
      );
      setPreauths((prev) => prev.map((p) => (p.id === id ? res.data : p)));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePreauthFileUpload = (id, files) => {
    setPreauths((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, documents: [...(p.documents || []), ...files] } : p
      )
    );
  };

  const theme = appTheme(isDarkMode);

  const contentMap = {
  dashboard: (
    <Dashboard currentHospital={currentHospital} preauths={preauths} />
  
    ),
    preauth: (
      <PreAuth
        preauths={preauths}
        setPreauths={setPreauths}
        onApprove={handlePreauthApprove}
        onCancel={handlePreauthCancel}
        onFileUpload={handlePreauthFileUpload}
      />
    ),
    admit: <AddPatient preauths={preauths} setPreauths={setPreauths} loggedInHospitalId={loggedInHospitalId}/>,
    medical: <MedicalDischarge />,
    bills: <GenerateBills loggedInHospitalId={loggedInHospitalId} />,
    track: <TrackClaimStatus preauths={preauths} />,
    response: <RespondQuery />,
  };

  const content = contentMap[selectedNav] || contentMap.dashboard;

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleToggleChange = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        <CssBaseline />
        <StyledAppBar position="fixed" open={open}>
          <Toolbar>
            {!open ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                aria-label="close drawer"
                onClick={handleDrawerClose}
                edge="start"
                sx={{ mr: 2 }}
              >
                <ChevronLeftIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Hospital Claim Processing System
              {currentHospital && ` - ${currentHospital.name}`}
            </Typography>
            <FormControlLabel
              control={<Switch checked={isDarkMode} onChange={handleToggleChange} />}
              label={isDarkMode ? "Dark Mode" : "Light Mode"}
              labelPlacement="start"
              sx={{ color: "inherit" }}
            />
          </Toolbar>
        </StyledAppBar>
        <StyledDrawer variant="permanent" open={open}>
          <DrawerHeader />
          <Divider />
          <List>
            {NAV_ITEMS.map(({ key, text, icon }) => (
              <ListItem key={key} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  selected={selectedNav === key}
                  onClick={() => setSelectedNav(key)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </StyledDrawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: "64px",
            width: `calc(100% - ${open ? drawerWidth : miniDrawerWidth}px)`,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
            overflow: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            minHeight: "calc(100vh - 64px - 48px)",
          }}
        >
          <DrawerHeader />
          {content}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default HospitalDashboard;
