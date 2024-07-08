import { Grid } from "@mui/material";
import { Field, Form, Formik, setNestedObjectValues } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { BaseSelect } from "../../../../../../../../../base";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import CircularLoader from "../../../../../../../../../../common/CircularLoader";
import {
  getActionLogAdditionalCategories,
  getActionLogCategoriesInputs,
  getActionLogSubCategories,
} from "../../../../../../../../../../store/actions/operationActions";
import {
  GET_ACTION_LOG_ADDITIONAL_CATEGORIES,
  GET_ACTION_LOG_CATEGORIES_INPUTS,
} from "../../../../../../../../../../store/actions/actionTypes";
import { getCurrentFileNameAndFunction } from "../../../../../../../../../../utils/getCurrentFileNameAndFunction";

const ActionLogCategorySelectionDropdowns = ({
  categoryDropdownFormRef,
  setDisableSubmitBtn,
}) => {
  const {
    actionLogCategories,
    actionLogSubCategories,
    actionLogAdditionalCategories,
  } = useSelector((state) => state.operations);

  const dispatch = useDispatch();

  //util function to set the only value coming from dropdown
  //by doing this, user wont have to select the only value present in the dropdown
  const updateCategoryFields = (
    fieldId,
    fieldValue,
    additionalAction,
    clearFields
  ) => {
    //setting the only id from the list
    categoryDropdownFormRef.current.setFieldValue(fieldId, fieldValue);

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "updateCategoryFields"
    );

    //calling next dropdown fetch api
    dispatch(additionalAction(fieldValue, logDetails));

    if (clearFields) {
      categoryDropdownFormRef.current.setFieldValue("categoryIdL3", "");
      dispatch({
        type: GET_ACTION_LOG_ADDITIONAL_CATEGORIES,
        payload: null,
      });
    }

    dispatch({
      type: GET_ACTION_LOG_CATEGORIES_INPUTS,
      payload: [],
    });

    categoryDropdownFormRef.current.setTouched(
      setNestedObjectValues(categoryDropdownFormRef.current.errors, false)
    );
  };

  //this useEffect will check if the sub categories lists has one single value & field is empty
  useEffect(() => {
    if (
      actionLogSubCategories?.length === 1 &&
      !categoryDropdownFormRef.current.values.categoryIdL2
    ) {
      updateCategoryFields(
        "categoryIdL2",
        actionLogSubCategories[0]?.id,
        getActionLogAdditionalCategories,
        true
      );
    }
  }, [categoryDropdownFormRef, actionLogSubCategories]);

  //this useEffect will check if the additional categories lists has one single value & field is empty
  useEffect(() => {
    if (
      actionLogAdditionalCategories?.length === 1 &&
      !categoryDropdownFormRef.current.values.categoryIdL3
    ) {
      updateCategoryFields(
        "categoryIdL3",
        actionLogAdditionalCategories[0]?.id,
        getActionLogCategoriesInputs,
        false
      );
      setDisableSubmitBtn(false);
    }
  }, [categoryDropdownFormRef, actionLogAdditionalCategories]);

  const callSubCategories = (id) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "callSubCategories"
    );
    dispatch(getActionLogSubCategories(id, logDetails));
  };

  const callAdditionalCategory = (id) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "callAdditionalCategory"
    );
    dispatch(getActionLogAdditionalCategories(id, logDetails));
  };

  const callCategoriesInputs = (id) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "callCategoriesInputs"
    );
    dispatch(getActionLogCategoriesInputs(id, logDetails));
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        categoryIdL1: null,
        categoryIdL2: null,
        categoryIdL3: null,
      }}
      validationSchema={Yup.object().shape({
        categoryIdL1: Yup.number()
          .required("Field is required!")
          .typeError("Field is required!"),
        categoryIdL2: Yup.number()
          .required("Field is required!")
          .typeError("Field is required!"),
        categoryIdL3: Yup.number()
          .required("Field is required!")
          .typeError("Field is required!"),
      })}
      innerRef={categoryDropdownFormRef}
    >
      {(form) => (
        <Form>
          <Grid
            item
            xs={12}
            gap={2}
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
            mt={1}
          >
            <Grid item xs={3.8}>
              {actionLogCategories ? (
                <Field
                  component={BaseSelect}
                  name="categoryIdL1"
                  optionLabel="categoryNameL1"
                  optionValue="id"
                  options={actionLogCategories}
                  displayLabel="Category*"
                  callSubCategories={callSubCategories}
                />
              ) : (
                <CircularLoader height="7vh" size={30} />
              )}
            </Grid>
            <Grid item xs={3.8}>
              {actionLogSubCategories ? (
                <Field
                  component={BaseSelect}
                  name="categoryIdL2"
                  optionLabel="categoryNameL2"
                  optionValue="id"
                  options={actionLogSubCategories}
                  disable={!form.values?.categoryIdL1}
                  displayLabel="Sub-Category*"
                  callAdditionalCategory={callAdditionalCategory}
                />
              ) : (
                <CircularLoader height="7vh" size={30} />
              )}
            </Grid>
            <Grid item xs={3.8}>
              {actionLogAdditionalCategories ? (
                <Field
                  component={BaseSelect}
                  name="categoryIdL3"
                  optionLabel="categoryNameL3"
                  optionValue="id"
                  options={actionLogAdditionalCategories}
                  disable={!form.values?.categoryIdL2}
                  displayLabel="Additional-Category*"
                  callCategoriesInputs={callCategoriesInputs}
                  setDisableSubmitBtn={setDisableSubmitBtn}
                />
              ) : (
                <CircularLoader height="7vh" size={30} />
              )}
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ActionLogCategorySelectionDropdowns;
