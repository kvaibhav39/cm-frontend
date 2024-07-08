import React, { useEffect } from "react";
import { Button, ButtonGroup } from "@mui/material";

export const CounterField = ({ form, field, ...props }) => {

  const { name, value = 0 } = field;
  
  const { setFieldValue } = form;
  const { setRolesValue } = props;

  const handleIncrement = () => {
    value < 10 && setFieldValue(name, value + 1);
    value < 10 && setRolesValue && setRolesValue(value + 1);
  };

  const handleDecrement = () => {
    let decrementValue = value - 1;
    
    decrementValue > 0 && setFieldValue(name, decrementValue);
    decrementValue > 0 && setRolesValue && setRolesValue(decrementValue);
  };

  useEffect(() => {
    setRolesValue && setRolesValue(value);
  }, [value]);

  return (
    <ButtonGroup size="small">
      <Button onClick={handleDecrement}>-</Button>
      <Button
        disableElevation={true}
        disableTouchRipple={true}
        variant="contained"
      >
        {value}
      </Button>
      <Button onClick={handleIncrement}>+</Button>
    </ButtonGroup>
  );
};
