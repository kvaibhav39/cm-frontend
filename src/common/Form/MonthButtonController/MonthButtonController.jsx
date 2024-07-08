import { Button, ButtonGroup } from "@mui/material";
import { useEffect } from "react";

export const MonthButtonController = ({ form, field, ...props }) => {
  const { name, value } = field;
  const { setFieldValue } = form;
  const { setGapCount } = props;

  useEffect(() => {
    setGapCount(value);
  }, [value]);

  return (
    <>
      <ButtonGroup>
        <Button
          onClick={() => {
            setFieldValue(name, 1);
            setGapCount(1);
          }}
          variant={value === 1 ? "contained" : "outlined"}
        >
          1 month
        </Button>
        <Button
          onClick={() => {
            setFieldValue(name, 2);
            setGapCount(2);
          }}
          variant={value === 2 ? "contained" : "outlined"}
        >
          2 months
        </Button>
        <Button
          onClick={() => {
            setFieldValue(name, 3);
            setGapCount(3);
          }}
          variant={value === 3 ? "contained" : "outlined"}
        >
          3 months
        </Button>
      </ButtonGroup>
    </>
  );
};
