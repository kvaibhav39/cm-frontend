import React, { useEffect } from "react";
import { Button, ButtonGroup } from "@mui/material";

export const MaxCounterField = ({ form, field, ...props }) => {
  let { name, value = 0 } = field;
  //   console.log("test", form, name.split("[")[1][0]);
  const { values, setFieldValue } = form;
  const { setRolesValue } = props;
  const question_index = name.split("[")[1][0];
  const maxNoAnswerOptions =
    values?.questions[question_index]?.answerChoice?.answerChoice?.length;

  const handleIncrement = () => {
    value < maxNoAnswerOptions && setFieldValue(name, value + 1);
    value < maxNoAnswerOptions && setRolesValue && setRolesValue(value + 1);
  };

  const handleDecrement = () => {
    value - 1 > 0 && setFieldValue(name, value - 1);
    value - 1 > 0 && setRolesValue && setRolesValue(value - 1);
  };

  useEffect(() => {
    setRolesValue && setRolesValue(value);
  }, [value]);

  useEffect(() => {
    if (value > maxNoAnswerOptions) {
      setFieldValue(
        `questions[${question_index}].answerChoice.noOfAnswersRequired`,
        maxNoAnswerOptions
      );
    }
  }, [maxNoAnswerOptions]);

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
