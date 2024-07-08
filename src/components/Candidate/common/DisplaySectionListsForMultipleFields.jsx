import { Box, Typography } from "@mui/material";
import { fromTo } from "../utils/getFromToDates";

const DisplaySectionListsForMultipleFields = ({
  values,
  setFieldValue,
  fieldArrayName,
  sectionName,
  runWhenSelected=()=>{},
}) => {
  return (
    <>
      {values?.map((value, index) => (
        <Box
          key={index}
          p={1}
          mb={1.5}
          sx={{
            border: (theme) => `1px solid ${theme.palette.grey[400]}`,
            borderRadius: "5px",
            background: (theme) =>
              value.selectedTab ? theme.palette.primary[100] : "none",
            cursor: "pointer",
          }}
          onClick={() => {
            values?.forEach((curr, ind) => {
              if (ind === index) {
                curr.selectedTab = true;
              } else {
                curr.selectedTab = false;
              }
            });

            setFieldValue(fieldArrayName, values);
            runWhenSelected()
          }}
        >
          <Box>
            <Typography fontSize="14px" fontWeight="700" textAlign="center">
              {sectionName} {index + 1}
            </Typography>
          </Box>
          <Typography
            fontSize="10px"
            fontWeight="500"
            color={(theme) => theme.palette.grey[700]}
            textAlign="center"
          >
            {fromTo(value, sectionName === "Address")}
          </Typography>
        </Box>
      ))}
    </>
  );
};

export default DisplaySectionListsForMultipleFields;
