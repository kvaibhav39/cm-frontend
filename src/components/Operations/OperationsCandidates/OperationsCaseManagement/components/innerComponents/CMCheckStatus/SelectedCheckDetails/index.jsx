import UpdateCheckDetails from "./components/UpdateCheckDetails";
import UpdateSubCheckDetails from "./components/UpdateSubCheckDetails";
import { isEqual } from "lodash";
import { memo } from "react";
import { Box } from "@mui/material";
import AddedSubCheckDetails from "../AddSubCheck/AddedSubCheckDetails";
import { useSelector } from "react-redux";

const SelectedCheckDetails = memo(
  () => {
    const { selectedSubCheckId } = useSelector((state) => state.operations);
    return (
      <>
        <UpdateCheckDetails />
        <Box
          sx={{
            border: (theme) => `1px solid ${theme.palette.grey[400]}`,
            borderRadius: "5px",
            width: { xs: "1000px", md: "auto" },
          }}
        >
          {selectedSubCheckId === "add-sub-check" ? (
            <AddedSubCheckDetails />
          ) : (
            <>
              <UpdateSubCheckDetails />
            </>
          )}
        </Box>
      </>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default SelectedCheckDetails;
