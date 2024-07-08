import { useState } from "react";
import { Select, MenuItem, Box } from "@mui/material";
import { updateStateWith } from "../CMCheckStatus/utils/updateStateWith";
import { useEffect } from "react";
import {
  DoNotDisturbAlt,
  HighlightOff,
  CheckCircleOutline,
  WarningAmber,
} from "@mui/icons-material";

const DropdownComponent = ({
  id = "",
  options,
  optionLabel = "",
  optionId = "",
  defaultValue = "",
  placeholderText = "",
  displayIcon,
  setDisableBtn = () => {},
  setDropdownVal = () => {},
  callWhenOnChange = () => {},
  toDisableDropdown = false,
  fullWidth = false,
  updateDisableStateDirectly = false,
}) => {
  const [innerValue, setInnerValue] = useState(defaultValue);

  useEffect(() => {
    setInnerValue(defaultValue);
    updateStateWith(setDropdownVal, id, defaultValue);
  }, [defaultValue, id, options, optionId]);

  return (
    <Select
      displayEmpty
      value={innerValue}
      size="small"
      fullWidth={fullWidth}
      variant="outlined"
      disabled={toDisableDropdown}
      onChange={(event) => {
        if (event.target.value === "") {
          updateStateWith(setDisableBtn, id, true, updateDisableStateDirectly);
        } else {
          //making update btn enable only when dropdown value gets changed
          updateStateWith(setDisableBtn, id, false, updateDisableStateDirectly);
        }

        //updating parent's state to the dropdown value
        updateStateWith(setDropdownVal, id, event.target.value);

        callWhenOnChange(event.target.value);
        setInnerValue(event.target.value);
      }}
      sx={{
        transform: "scale(0.8)",
        height: "35px",
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
          fontSize: "12px",
        },
      }}
    >
      {!defaultValue && (
        <MenuItem value="" sx={{ fontSize: "12px" }}>
          {placeholderText || "Select User"}
        </MenuItem>
      )}
      {options?.map((option, index) => (
        <MenuItem
          key={index}
          value={option[optionId] || ""}
          sx={{ fontSize: "12px" }}
        >
          {displayIcon ? (
            <Box
              component="span"
              sx={{ fontSize: "14px", marginRight: "5px", marginTop: "2px" }}
            >
              {option[optionId] === 1 ? (
                <CheckCircleOutline color="success" />
              ) : option[optionId] === 2 ? (
                <WarningAmber color="warning" />
              ) : option[optionId] === 3 ? (
                <HighlightOff color="error" />
              ) : (
                <DoNotDisturbAlt />
              )}
            </Box>
          ) : null}{" "}
          {option[optionLabel]}
        </MenuItem>
      ))}
    </Select>
  );
};

export default DropdownComponent;
