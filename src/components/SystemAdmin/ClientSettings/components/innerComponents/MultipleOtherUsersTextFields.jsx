import { DeleteOutline, Add } from "@mui/icons-material";
import { Box, Button,  IconButton, InputAdornment } from "@mui/material";
import {  Field } from "formik";
import { InputTextField } from "../../../../../common/Form/InputTextField/InputTextField";
import { cloneDeep } from "lodash";

const MultipleOtherUsersTextFields = ({
  values,
  errorMsg,
  param,
  fieldName,
  setFieldValue,
}) => {
  const handleAnswerAdd = () => {
    let answerChoice = values[param][fieldName]
      ? [...cloneDeep(values[param][fieldName]), ""]
      : [""];
    setFieldValue(`${param}.${fieldName}`, answerChoice);
  };

  const handleAnswerDelete = (i) => {
    let val = cloneDeep(values[param][fieldName]);
    let answerChoice = val?.filter((_, index) => index !== i);
    setFieldValue(`${param}.${fieldName}`, answerChoice);
  };

  return (
    <Box display="grid" placeItems="center" gap={1}>
      {values[param][fieldName] &&
        values[param][fieldName]?.map((_, i) => (
          <Field
            key={i}
            name={`${param}.${fieldName}.${i}`}
            label={`User ${i + 1}`}
            inputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {i ? (
                    <IconButton
                      onClick={() => handleAnswerDelete(i)}
                      edge="end"
                      color="error"
                    >
                      <DeleteOutline />
                    </IconButton>
                  ) : null}
                </InputAdornment>
              ),
            }}
            required
            component={InputTextField}
            fullWidth={false}
            error={errorMsg && errorMsg[i]}
          />
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

export default MultipleOtherUsersTextFields;
