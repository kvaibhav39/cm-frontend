import { useState } from "react";
import { Typography, Select, MenuItem } from "@mui/material";
import { updateStateWith } from "../CMCheckStatus/utils/updateStateWith";
import { useEffect } from "react";

const CheckStatusDropdown = ({
  id = "",
  options = [],
  optionLabel = "",
  optionId = "",
  defaultValue = "",
  setDisableBtn = () => {},
  setDropdownVal = () => {},
  toDisableDropdown = false,
  updateCheckSummary = () => {},
  updateDisableStateDirectly = false,
}) => {
  const [innerValue, setInnerValue] = useState(
    defaultValue || options[0][optionId]
  );

  useEffect(() => {
    setInnerValue(defaultValue || options[0][optionId]);
    updateStateWith(setDropdownVal, id, defaultValue || options[0][optionId]);
  }, [defaultValue, id, options, optionId]);

  const calculateColors = (value) => {
    let colorObj = {};

    if (value === 13) {
      colorObj.color = "#00C95C";
      colorObj.backgroundColor = "#D9F9EB";
    } else if (value === 14 || (value === 1) | (value === 5)) {
      colorObj.color = "grey";
      colorObj.backgroundColor = "lightgrey";
    } else if (value === 4 || value === 2 || value === 3) {
      colorObj.color = "#F50808";
      colorObj.backgroundColor = "#FFE8E8";
    } else if (value === 11 || value === 12) {
      colorObj.color = "#fff";
      colorObj.backgroundColor = "#F50808";
    } else {
      colorObj.color = "#F59008";
      colorObj.backgroundColor = "#FFF6E1";
    }
    return colorObj;
  };

  return (
    <Select
      displayEmpty
      value={innerValue}
      size="small"
      variant="outlined"
      disabled={toDisableDropdown}
      onChange={(event) => {
        //making update btn enable only when dropdown value gets changed
        updateStateWith(setDisableBtn, id, false, updateDisableStateDirectly);

        //updating parent's state to the dropdown value
        updateStateWith(setDropdownVal, id, event.target.value);

        setInnerValue(event.target.value);
        updateCheckSummary(event.target.value);
      }}
      sx={{
        transform: "scale(0.8)",
        height: "35px",
        borderRadius: "20px",
        background: calculateColors(innerValue)?.backgroundColor,
        border: `1px solid ${calculateColors(innerValue)?.color} !important`,

        "& .MuiSelect-icon": {
          color: calculateColors(innerValue)?.color,
        },

        "& .MuiSelect-select": {
          border: `none !important`,
          borderRadius: "20px !important",
        },

        "& .MuiTypography-root": {
          color: calculateColors(innerValue)?.color,
          margin: "revert",
        },

        "& .MuiOutlinedInput-notchedOutline": {
          //to remove grey border around select component
          borderRadius: "inherit",
        },

        "& fieldset": {
          //to remove blue border when select is focused/clicked upon
          borderColor: "transparent !important",
          borderWidth: "1px !important",
        },
      }}
    >
      {options?.map((option, index) => (
        <MenuItem
          key={index}
          value={option[optionId] || ""}
          sx={{
            margin: "10px",
            borderRadius: "10px",
            backgroundColor: calculateColors(option[optionId])?.backgroundColor,
            display: "flex ",
            justifyContent: "center ",
          }}
        >
          <Typography
            fontSize="12px"
            fontWeight={550}
            color={
              innerValue === option[optionId]
                ? "none"
                : calculateColors(option[optionId])?.color
            }
          >
            {option[optionLabel]}
          </Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default CheckStatusDropdown;
