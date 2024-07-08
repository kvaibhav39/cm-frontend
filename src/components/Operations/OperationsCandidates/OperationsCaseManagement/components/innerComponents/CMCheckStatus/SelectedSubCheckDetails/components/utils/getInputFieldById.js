import { FastField } from "formik";
import { INPUT_TYPES } from "../../../../../../../../../../store/constant";
import {
  BaseCurrencyAutocomplete,
  BaseDatePicker,
  BaseSelect,
  BaseTextField,
} from "../../../../../../../../../base";
import { Box, Typography } from "@mui/material";
import { PhoneNumberTextField } from "../../../../../../../../../../common/Form/PhoneNumberTextField/PhoneNumberTextField";
import { BaseDateTimePicker } from "../../../../../../../../../base/BaseDateTimePicker";
import { InputTextField } from "../../../../../../../../../../common/Form/InputTextField/InputTextField";

export const getInputFieldById = (
  data,
  storedInFormikField,
  extraFieldData,
  catInputDetailsId
) => {
  let inputFieldComponent;

  let fieldName = extraFieldData
    ? extraFieldData?.label || "Please respond" + catInputDetailsId
    : data?.categoryInputName;

  let labelName = extraFieldData
    ? extraFieldData?.label
    : data?.categoryInputName;

  let commonParams = {
    name: storedInFormikField
      ? `${storedInFormikField}.${fieldName}`
      : `${fieldName}`,
    label: labelName ? (
      `${labelName}` + `${data?.isMandatory ? "*" : ""}`
    ) : (
      <Box sx={{ opacity: 0 }}>temp</Box>
    ),
    makeFontSizeSmaller:true
  };

  let errorParams = (form) => {
    return {
      error: storedInFormikField
        ? form?.touched?.[storedInFormikField] &&
          form?.touched?.[storedInFormikField][fieldName] &&
          form?.errors?.[storedInFormikField] &&
          form?.errors?.[storedInFormikField][fieldName]
        : form?.touched &&
          form?.touched?.[fieldName] &&
          form?.errors &&
          form?.errors?.[fieldName],
    };
  };

  let fieldTypeId = extraFieldData
    ? extraFieldData?.fieldTypeId
    : data?.categoryInputTypeId;

  switch (fieldTypeId) {
    case INPUT_TYPES.TEXTBOX:
    case INPUT_TYPES.EMAIL_INPUT:
      inputFieldComponent = (form) => (
        <FastField component={BaseTextField} {...commonParams} />
      );
      break;

    case INPUT_TYPES.DROPDOWN:
      inputFieldComponent = (form) => (
        <FastField
          component={BaseSelect}
          {...commonParams}
          options={data?.actionLogCategoryInputFieldsL1Data}
          optionLabel="categoryInputFieldNameL1"
          optionValue="id"
        />
      );
      break;

    case INPUT_TYPES.PHONE_INPUT:
      inputFieldComponent = (form) => (
        <Box>
          <Typography
            sx={{
              marginBottom: "4px",
            }}
            fontSize="12px"
          >
            {commonParams.label}
          </Typography>
          <FastField
            name={commonParams.name}
            placeholder="Your phone number"
            className="round_phone"
            component={PhoneNumberTextField}
          />
        </Box>
      );
      break;

    case INPUT_TYPES.DATE_TIME:
      inputFieldComponent = (form) => (
        <FastField component={BaseDateTimePicker} {...commonParams} />
      );
      break;

    case INPUT_TYPES.DATE:
      inputFieldComponent = (form) => (
        <FastField
          component={BaseDatePicker}
          views={["year", "month", "day"]}
          placeholder="DD-MMM-YYYY"
          inputFormat="dd-MMM-yyyy"
          {...commonParams}
        />
      );
      break;

    case INPUT_TYPES.TEXT_AREA:
      inputFieldComponent = (form) => (
        <FastField
          component={InputTextField}
          multiline
          {...commonParams}
          {...errorParams(form)}
        />
      );

      break;

    case INPUT_TYPES.CURRENCY_DROPDOWN:
      inputFieldComponent = (form) => (
        <FastField
          component={BaseCurrencyAutocomplete}
          {...commonParams}
          {...errorParams(form)}
        />
      );
      break;
  }

  return inputFieldComponent;
};
