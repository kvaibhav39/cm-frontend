import { Box, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const Heading = () => {
  const { subChecksList, selectedSubCheckId } = useSelector(
    (state) => state.operations
  );

  let selectedSubCheck = useMemo(() => {
    return subChecksList?.find((curr) => curr.id === selectedSubCheckId);
  }, [subChecksList, selectedSubCheckId]);

  return (
    <>
      {selectedSubCheck ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ backgroundColor: (theme) => `${theme.palette.primary[100]}` }}
          p={2}
          gap={1}
        >
          <Box display='flex' alignItems="center" gap={1}>
            <Typography fontWeight={500} textAlign="center">
              {selectedSubCheck?.subCheckDisplayName}{" "}
            </Typography>
            <Typography
              fontWeight={550}
              textAlign="center"
              color={(theme) => theme.palette.primary.main}
            >
              (Assignee - {selectedSubCheck?.assigneeName || "Not Assigned Yet"}
              )
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={{ xs: "center", md: "space-between" }}
            flexDirection={{ xs: "column", md: "row" }}
            gap={{ xs: 0, md: 4 }}
          >
            {" "}
            <Box
              display="flex"
              alignItems="center"
              justifyContent={{ xs: "center", md: "space-between" }}
              gap={3}
            >
              <Typography fontWeight={550} textAlign="center">
                {selectedSubCheck?.subCheckVerificationResultStatusName ||
                  "NO RESULTS YET"}
              </Typography>
              <Typography fontWeight={550} textAlign="center">
                |
              </Typography>
              <Typography fontWeight={550} textAlign="center">
                {selectedSubCheck?.checkInternalStatusName || "NO RESULTS YET"}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default Heading;
