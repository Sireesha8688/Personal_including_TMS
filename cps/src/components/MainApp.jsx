import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import AppTitle from "../utils/AppTitle";
import RoleConfig from "../utils/RoleConfig";

const mainTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    primary: {
      main: "#90caf9",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const getApiEndpoint = (role) => {
  switch (role) {
    case "Admin":
      return "admins";
    case "Customer":
      return "customers";
    case "Verifier":
      return "verifiers";
    case "Insurer":
      return "insurers";
    case "Hospital":
      return "hospitals";
    default:
      return "";
  }
};

const MainApp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role = null, id = null } = location.state || {};
  const router = useDemoRouter("/dashboard");
  const currentSegment = router.pathname.replace("/", "") || "dashboard";
  const { navigation, routes } = RoleConfig[role];
  const ComponentToRender = routes[currentSegment];

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (role && id) {
      const endpoint = getApiEndpoint(role);
      axios
        .get(`http://localhost:9090/${endpoint}/${id}`)
        .then((res) => {
          console.log("Fetched User Data:", res.data);
          setUser({ ...res.data, role });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUser({ id, role });
        });
    }
  }, [role, id]);

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  return (
    <AppProvider navigation={navigation} router={router} theme={mainTheme}>
      <DashboardLayout
        slots={{
          appTitle: () => <AppTitle user={user} onLogout={handleLogout} />,
        }}
        sx={{
          "& .MuiStack-root > .MuiStack-root": {
            width: "100%",
          },
        }}
      >
        <ComponentToRender id={id} pathname={router.pathname} user={user} />
      </DashboardLayout>
    </AppProvider>
  );
};

export default MainApp;
