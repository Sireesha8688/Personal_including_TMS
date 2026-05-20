import { Box, Typography } from "@mui/material";

const AppTitle = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* {logoSrc && (
        <img src={logoSrc} alt="logo" style={{ marginRight: 8, height: 24 }} />
      )} */}
      <Typography
        variant="h6"
        component="a"
        href={"/"}
        sx={{ textDecoration: "none", color: "inherit" }}
      >
        Claim Processing System
      </Typography>
    </Box>
  );
};

export default AppTitle;
