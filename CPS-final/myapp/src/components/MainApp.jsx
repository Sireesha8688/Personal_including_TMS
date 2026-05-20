import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { createTheme } from "@mui/material/styles";
import AppTitle from "../utils/AppTitle";
import RoleConfig from "../utils/RoleConfig";
import { useLocation } from "react-router";

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

const MainApp = () => {
  const location = useLocation();
  const { role = null, id = null } = location.state || {};

  console.log("Role in MainApp:", role + "id   ---" + id);
  const router = useDemoRouter("/dashboard");
  const currentSegment = router.pathname.replace("/", "") || "dashboard";
  const { navigation, routes } = RoleConfig[role];

  const ComponentToRender = routes[currentSegment];

  return (
    <AppProvider navigation={navigation} router={router} theme={mainTheme}>
      <DashboardLayout
        slots={{
          appTitle: AppTitle,
        }}
        sx={{
          "& .MuiStack-root > .MuiStack-root": {
            width: "100%",
          },
        }}
      >
        <ComponentToRender id={id} pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
};

export default MainApp;
