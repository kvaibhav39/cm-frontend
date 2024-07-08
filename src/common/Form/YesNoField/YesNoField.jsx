import React, { useEffect } from "react";
import { Button, ButtonGroup } from "@mui/material";

export const YesNoField = ({ form, field, ...props }) => {
  const { name, value = 0 } = field;
  const { setFieldValue } = form;
  const { onChange, size="small" } = props;

  const handleIncrement = () => {
    setFieldValue(name, true);
    onChange && onChange(true);
  };

  const handleDecrement = () => {
    value > 0 && setFieldValue(name, false);
    onChange && onChange(false);
  };

  useEffect(() => {
    onChange && onChange(value);
  }, [value]);

  return (
    <ButtonGroup>
      <Button
        onClick={handleIncrement}
        variant={value === true ? "contained" : "outlined"}
        size={size}
        disableElevation
      >
        Y
      </Button>
      <Button
        onClick={handleDecrement}
        variant={value === false ? "contained" : "outlined"}
        size={size}
        disableElevation
      >
        N
      </Button>
    </ButtonGroup>
  );
};
