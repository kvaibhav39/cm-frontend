import React, { useMemo } from "react";
import { MenuItem, Typography } from "@mui/material";

const DisplayChip = ({
  id,
  rowData,
  checkStatusDropdown,
  checkInternalStatusLists,
}) => {
  const calculateColors = (value = "") => {
    let colorObj = {};

    //calculating color of check status
    if (value === 13) {
      colorObj.color = "#00C95C";
      colorObj.backgroundColor = "#D9F9EB";
    } else if (value === 14 || value === 1) {
      //open
      colorObj.color = "grey";
      colorObj.backgroundColor = "lightgrey";
    } else if (value === 4 || value === 2 || value === 3) {
      //Pending Insufficiency, Awaiting Cost Approval, Waiting Third Party
      colorObj.color = "#F50808";
      colorObj.backgroundColor = "#FFE8E8";
    } else {
      //In-Progress
      colorObj.color = "#F59008";
      colorObj.backgroundColor = "#FFF6E1";
    }
    return colorObj;
  };

  let selectedCheck = useMemo(() => {
    let temp = {};

    let foundCheck = checkInternalStatusLists?.find(
      (curr) => curr.id === checkStatusDropdown[id]
    );

    //finding and abstracting check status name from check internal status
    if (!foundCheck) {
      temp.id = rowData?.checkInternalStatusId;
      temp.checkStatusName = rowData?.checkStatusName;
    } else {
      temp = foundCheck;
    }

    return temp;
  }, [id, rowData, checkStatusDropdown, checkInternalStatusLists]);

  return (
    <MenuItem
      value={selectedCheck.id || ""}
      sx={{
        margin: "10px",
        borderRadius: "10px",
        backgroundColor: calculateColors(selectedCheck.id)?.backgroundColor,
        display: "flex ",
        justifyContent: "center ",
      }}
    >
      <Typography
        fontSize="12px"
        fontWeight={550}
        color={calculateColors(selectedCheck.id)?.color}
      >
        {selectedCheck.checkStatusName}
      </Typography>
    </MenuItem>
  );
};

export default DisplayChip;
