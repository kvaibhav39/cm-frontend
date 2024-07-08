import { Box, Button, IconButton } from "@mui/material";
import { FastField } from "formik";
import React from "react";
import { BaseSelect, BaseTextField } from "../../../../base";
import { Add, DeleteOutline } from "@mui/icons-material";
import { cloneDeep } from "lodash";
import { frequencyUnits } from "../../../constants/frequencyUnits";

const ReminderFrequency = ({
  fieldName,
  values,
  setFieldValue,
}) => {
  

  const handleAnswerAdd = () => {
    let answerChoice = values[fieldName]
      ? [...cloneDeep(values[fieldName]), { value: null, unit: null }]
      : [{ value: null, unit: null }];
    setFieldValue(`${fieldName}`, answerChoice);
  };

  const handleAnswerDelete = (i) => {
    let val = cloneDeep(values[fieldName]);
    let answerChoice = val?.filter((_, index) => index !== i);
    setFieldValue(`${fieldName}`, answerChoice);
  };

  return (
    <Box display="grid" placeItems="center">
      {values[fieldName] &&
        values[fieldName]?.length &&
        values[fieldName].map((freq, ind) => (
          <Box display="flex" alignItems="center" my={1} position='relative'>
            <Box display="flex" alignItems="center" gap={1}>
              <FastField
                component={BaseTextField}
                type="number"
                label={`Frequency ${ind + 1}`}
                name={`${fieldName}.${ind}.value`}
              />
              <FastField
                component={BaseSelect}
                name={`${fieldName}.${ind}.unit`}
                label="Unit"
                optionLabel="unitName"
                optionValue="unitVal"
                options={frequencyUnits}
              />
            </Box>
            <Box mt={0.25}>
              {ind ? (
                <IconButton
                  onClick={() => handleAnswerDelete(ind)}
                  edge="end"
                  color="error"
                >
                  <DeleteOutline />
                </IconButton>
              ) : null}
            </Box>
          </Box>
        ))}
      <Button
        variant="contained"
        onClick={handleAnswerAdd}
        sx={{ width: 20, height: 30 }}
      >
        <Add />
      </Button>
    </Box>
  );
};

export default ReminderFrequency;
