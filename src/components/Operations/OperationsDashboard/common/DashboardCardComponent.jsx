import { Box, Grid, Typography } from "@mui/material";
import React from "react";

const DashboardCardComponent = ({ heading, numbers, icon }) => {
  return (
    <Box
      display="flex"
      p={6}
      sx={{
        background: (theme) => theme.palette.grey[100],
        borderRadius: "10px",
        boxShadow:
          "rgba(0, 0, 0, 0.14) 0px 4px 20px 0px, rgba(64, 64, 64, 0.4) 0px 7px 10px -5px",
      }}
      position="relative"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background:
            "linear-gradient(90deg, rgba(0,30,175,1) 0%, rgba(0,37,209,1) 44%, rgba(45,72,230,1) 100%)",
          boxShadow:
            "rgba(0, 0, 0, 0.14) 0px 4px 20px 0px, rgba(64, 64, 64, 0.4) 0px 7px 10px -5px",
          height: { xs: "50px", sm: "80px" },
          width: { xs: "50px", sm: "80px" },
          borderRadius: "10px",
        }}
        position="absolute"
        top={-20}
        left={{ xs: 20, sm: 40 }}
      >
        {React.createElement(icon, {
          sx: { color: "#fff", fontSize: { xs: "20px", sm: "40px" } },
        })}{" "}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        position="absolute"
        top={20}
        left="45%"
      >
        <Typography
          fontWeight={600}
          fontSize={{ xs: "14px", sm: "20px" }}
          color={(theme) => theme.palette.grey[800]}
          sx={{ letterSpacing: "2px", wordBreak: "break-all" }}
        >
          {heading}
        </Typography>
        <Typography
          fontSize={{ xs: "12px", sm: "18px" }}
          fontWeight={500}
          mt={1}
        >
          {numbers}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardCardComponent;
