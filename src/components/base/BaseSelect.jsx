import { get, omit } from "lodash";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { BaseInput, uid } from "./BaseInput";
import { useState } from "react";
import { useEffect } from "react";
import {
  GET_ACTION_LOG_ADDITIONAL_CATEGORIES,
  GET_ACTION_LOG_CATEGORIES_INPUTS,
  GET_ACTION_LOG_SUB_CATEGORIES,
} from "../../store/actions/actionTypes";
import { useDispatch } from "react-redux";
import { setNestedObjectValues } from "formik";

const BaseSelect = ({
  field,
  label,
  children,
  optionValue = "value",
  optionLabel = "label",

  id = uid(4),
  options = [],

  form: {
    touched,
    errors,
    setFieldValue,
    setTouched,
    setErrors,
    setFieldError,
  },
  index,
  values,
  displayLabel = "",
  runWhenSelect = () => {},
  ...props
}) => {
  const [innerValue, setInnerValue] = useState(field.value || "");

  let error = !!get(touched, field.name) && !!get(errors, field.name);

  const dispatch = useDispatch();

  useEffect(() => {
    setInnerValue(field.value || "");
  }, [field.value]);

  options = typeof options === "function" ? options() : options;

  return (
    <BaseInput id={id} label={label} name={field.name} {...props}>
      {displayLabel ? <InputLabel id={id}>{displayLabel}</InputLabel> : null}
      <Select
        labelId={id}
        name={field.name}
        error={error}
        value={innerValue || ""}
        onBlur={field.onBlur}
        size="small"
        variant="outlined"
        disabled={props.disable || false}
        onChange={async (event) => {
          if (optionLabel === "reasonName") {
            if (event.target.value === 8) {
              setFieldValue(`employments.${index}.otherReasonForLeaving`, "");
            } else if (event.target.value === 5) {
              setFieldValue(
                `employments.${index}.wasResignationRequested`,
                false
              );
              setFieldValue(
                `employments.${index}.reasonOfResignationRequested`,
                ""
              );
            }
          }

          if (optionLabel === "educationTypeName") {
            if (event.target.value !== 3) {
              setFieldValue(`qualifications.${index}.otherEducationType`, "");
            }
          }

          if (optionLabel === "roleName" && field.name === 'role') {
            props.onRoleSelection();
            setFieldValue(`subRole`, 6);
          }

          //operations action log categories
          if (field.name === "categoryIdL1" && event.target.value) {
            props.callSubCategories(event.target.value);

            //on selection of new category we will clear sub categories, additional categories & categories inputs
            setFieldValue("categoryIdL2", "");
            dispatch({
              type: GET_ACTION_LOG_SUB_CATEGORIES,
              payload: null,
            });
            dispatch({
              type: GET_ACTION_LOG_ADDITIONAL_CATEGORIES,
              payload: [],
            });
            dispatch({
              type: GET_ACTION_LOG_CATEGORIES_INPUTS,
              payload: [],
            });
            setTouched(setNestedObjectValues(errors, false));
          }

          //operations action log sub-categories
          if (field.name === "categoryIdL2" && event.target.value) {
            props.callAdditionalCategory(event.target.value);

            //on selection of new sub category we will clear categories inputs
            setFieldValue("categoryIdL3", "");
            dispatch({
              type: GET_ACTION_LOG_ADDITIONAL_CATEGORIES,
              payload: null,
            });
            dispatch({
              type: GET_ACTION_LOG_CATEGORIES_INPUTS,
              payload: [],
            });
            setTouched(setNestedObjectValues(errors, false));
          }

          //operations action log additional categories
          if (field.name === "categoryIdL3" && event.target.value) {
            props.callCategoriesInputs(event.target.value);
            props.setDisableSubmitBtn(false);
            dispatch({
              type: GET_ACTION_LOG_CATEGORIES_INPUTS,
              payload: null,
            });
            setTouched(setNestedObjectValues(errors, false));
          }

          //to remove other permision field error when one is selected
          if (
            (field.name === "permissionsActionsId" ||
              field.name === "permissionsPagesId") &&
            event.target.value
          ) {
            setFieldError("permissionsActionsId", "");
            setFieldError("permissionsPagesId", "");
          }

          runWhenSelect(event.target.value);
          setFieldValue(field.name, event.target.value);
          await Promise.resolve();
          setInnerValue(event.target.value);
        }}
        {...props}
      >
        {options?.map((option, index) => (
          <MenuItem key={index} value={get(option, optionValue) || ""}>
            {get(option, optionLabel)}
          </MenuItem>
        ))}
        {children}
      </Select>
    </BaseInput>
  );
};

export { BaseSelect };
