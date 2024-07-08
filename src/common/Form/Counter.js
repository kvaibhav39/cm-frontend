import { useEffect, useState } from "react";
import { Button, ButtonGroup } from "@mui/material";

export const Counter = ({ setFieldValue, fieldName, value }) => {
  const [count, setCount] = useState(value);

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    count > 0 && setCount((prev) => prev - 1);
  };

  useEffect(() => {
    setFieldValue(fieldName, count);
  }, [count]);

  return (
    <ButtonGroup size="small">
      <Button onClick={handleDecrement}>-</Button>
      <Button
        disableElevation={true}
        disableTouchRipple={true}
        variant="contained"
      >
        {count}
      </Button>
      <Button onClick={handleIncrement}>+</Button>
    </ButtonGroup>
  );
};
