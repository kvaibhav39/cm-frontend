import { DeleteOutline, InsertDriveFileOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { fromTo } from "../utils/getFromToDates";

const DisplayHeadingForMultipleFields = ({
  index,
  heading,
  currentValue,
  sectionValues,
  fieldArrayName,
  setFieldValue,
  runWhenDelete = () => {},
}) => {
  return (
    <Box
      p={3}
      width={"100%"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        flexDirection={{
          xs: "column",
          sm: "row",
        }}
      >
        <Box display={"flex"} alignItems={"center"}>
          <InsertDriveFileOutlined />
          <Typography fontSize={"20px"} fontWeight="550" ml={1}>
            {heading}&nbsp; {index + 1}
          </Typography>
        </Box>
        <Box ml={1}>
          <Typography
            fontSize={{
              xs: "14px",
              md: "16px",
            }}
            fontWeight="500"
            color={(theme) => theme.palette.primary.main}
          >
            {fromTo(currentValue, heading === "Address")}
          </Typography>
        </Box>
      </Box>

      <Box>
        <IconButton
          aria-label="delete"
          color="error"
          onClick={async (e) => {
            e.stopPropagation();
            if (sectionValues?.length) {
              let filteredValues = sectionValues?.filter(
                (_, ind) => index !== ind
              );

              if (index === filteredValues?.length && index) {
                index--;
              }

              filteredValues?.forEach((curr, ind) => {
                if (ind === index) {
                  curr.selectedTab = true;
                } else {
                  curr.selectedTab = false;
                }
              });

              setFieldValue(fieldArrayName, filteredValues);

              await Promise.resolve();
              runWhenDelete();
            }
          }}
        >
          <DeleteOutline />
        </IconButton>
      </Box>
    </Box>
  );
};

export default DisplayHeadingForMultipleFields;
