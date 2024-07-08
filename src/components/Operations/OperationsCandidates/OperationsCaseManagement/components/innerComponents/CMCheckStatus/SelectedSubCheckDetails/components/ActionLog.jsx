import { Box, Divider } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Route } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  getActionLogCategories,
  submitActionLog,
} from "../../../../../../../../../store/actions/operationActions";
import { cloneDeep, omit } from "lodash";
import { setNestedObjectValues } from "formik";
import ActionLogCategorySelectionDropdowns from "./innerComponents/ActionLogCategorySelectionDropdowns";
import ActionLogCategoryInputFields from "./innerComponents/ActionLogCategoryInputFields";
import ActionLogFileUpload from "./innerComponents/ActionLogFileUpload";
import { useSearchParams } from "react-router-dom";
import { ERROR } from "../../../../../../../../../store/constant";
import { setToastNotification } from "../../../../../../../../../store/actions/toastNotificationActions";
import { removingExtraFields } from "./utils/removingExtraFields";
import { replacingDropdownId } from "./utils/replacingDropdownId";
import { checkFromDateToDate } from "./utils/checkFromDateToDate";
import { formatDateValues } from "./utils/formatDateValues";
import { removeEmptyObjects } from "./utils/removeEmptyObjects";
import {
  GET_ACTION_LOG_ADDITIONAL_CATEGORIES,
  GET_ACTION_LOG_CATEGORIES_INPUTS,
  GET_ACTION_LOG_SUB_CATEGORIES,
} from "../../../../../../../../../store/actions/actionTypes";
import { getCurrencies } from "../../../../../../../../../store/actions/candidateAction";
import CommonHeadingComponent from "./innerComponents/CommonHeadingComponent";
import { getCurrentFileNameAndFunction } from "../../../../../../../../../utils/getCurrentFileNameAndFunction";

const ActionLog = () => {
  const [open, setOpen] = useState(false);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryDropdownFormRef = useRef();
  const categoryInputsFormRef = useRef();
  const fileUploadFormRef = useRef();

  const { currencies } = useSelector((state) => state.candidate);

  const dispatch = useDispatch();

  const {
    actionLogCategories,
    actionLogCategoriesInputs,
    subChecksList,
    selectedSubCheckId,
  } = useSelector((state) => state.operations);

  let selectedSubCheck = useMemo(() => {
    return subChecksList?.find((curr) => curr.id === selectedSubCheckId);
  }, [subChecksList, selectedSubCheckId]);

  //fetching categories lists
  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    if (!actionLogCategories) {
      dispatch(getActionLogCategories(logDetails));
    }
    dispatch({
      type: GET_ACTION_LOG_SUB_CATEGORIES,
      payload: [],
    });
    dispatch({
      type: GET_ACTION_LOG_ADDITIONAL_CATEGORIES,
      payload: [],
    });
    dispatch({
      type: GET_ACTION_LOG_CATEGORIES_INPUTS,
      payload: [],
    });
    !currencies && dispatch(getCurrencies(logDetails));
  }, []);

  const handleSubmit = async () => {
    let currentLogDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    //category dropdown fields
    let {
      validateForm: categoryDropdownValidateForm,
      values: dropdownFormValues,
      resetForm: dropdownResetForm,
    } = categoryDropdownFormRef.current;

    let { categoryIdL1, categoryIdL2, categoryIdL3 } = dropdownFormValues;

    let categoryDropdownFormErrors = await categoryDropdownValidateForm();

    //if any category dropdown is not selected then we will simply return by touching all the dropdowns
    if (
      categoryDropdownFormErrors &&
      Object.keys(categoryDropdownFormErrors)?.length
    ) {
      return categoryDropdownFormRef.current.setTouched(
        setNestedObjectValues(categoryDropdownFormErrors, true)
      );
    }

    //category input fields
    let {
      validateForm,
      values,
      setTouched,
      resetForm: categoryInputsResetForm,
    } = categoryInputsFormRef.current;

    //validating category input fields
    let errors = await validateForm();
    let validationErrors = cloneDeep(errors);
    let categoryInputValues = cloneDeep(values);

    //remove extra fields from values & errors
    removingExtraFields(
      validationErrors,
      categoryInputValues,
      actionLogCategoriesInputs
    );

    //replacing selected dropdown id with respective string
    replacingDropdownId(
      actionLogCategoriesInputs,
      categoryInputValues,
      currencies
    );

    //Remove empty objects
    removeEmptyObjects(categoryInputValues);
    removeEmptyObjects(validationErrors);

    //returns when there is any error present in the category input fields
    if (Object.keys(validationErrors)?.length) {
      //since we are submitting our form on 'onClick' event on next btn fields wont get touched
      //so we have to explicitly touch them so that validation error msgs below fields can get displayed
      //and this can be achieved by using 'setTouched' &  'setNestedObjectValues' which is provided by formik
      return setTouched(setNestedObjectValues(validationErrors, true));
    }

    //uploaded files values
    let { values: fileUploadValues, resetForm: fileUploadResetForm } =
      fileUploadFormRef.current;

    //structuring payload layout
    let payload = {
      categoryIdL1,
      categoryIdL2,
      categoryIdL3,
      subCheckId: selectedSubCheck?.id,
      logDetails: categoryInputValues,
      attachments: fileUploadValues?.files?.map((file) => {
        file.attachFileToReport =
          (fileUploadValues?.attachFileToReport &&
            fileUploadValues?.attachFileToReport[file?.attachmentName]) ||
          false;

        return omit(file, ["status"]);
      }),
    };

    //to check if from date is less than to date or not
    let fromDateisGreaterThanToDate = checkFromDateToDate(payload?.logDetails);

    if (fromDateisGreaterThanToDate) {
      return dispatch(
        setToastNotification(
          ERROR,
          "from date should be less than to date",
          currentLogDetails
        )
      );
    }

    // Compare 'conductedDate' and 'respondedDate' dates
    if (
      payload?.logDetails["Conducted Date"] &&
      payload?.logDetails["Respond Received Date"]
    ) {
      const conductedDate = new Date(payload?.logDetails["Conducted Date"]);
      const respondedDate = new Date(
        payload?.logDetails["Respond Received Date"]
      );

      if (conductedDate >= respondedDate) {
        return dispatch(
          setToastNotification(
            ERROR,
            "conducted date should be less than respond received date",
            currentLogDetails
          )
        );
      }
    }

    //updating date type field values with appropriate formats
    formatDateValues(payload?.logDetails, actionLogCategoriesInputs);

    dispatch(
      submitActionLog(
        payload,
        +searchParams.get("candidatesCasesId"),
        currentLogDetails
      )
    );

    dropdownResetForm();
    categoryInputsResetForm();
    fileUploadResetForm();
  };

  return (
    <>
      <Divider
        sx={{ width: "95%", margin: "10px auto", color: "#000", height: "4px" }}
      />
      <Box px={2} py={1} gap={1}>
        <CommonHeadingComponent
          open={open}
          setOpen={setOpen}
          IconComponent={<Route sx={{ transform: "rotate(90deg)" }} />}
          title="Verification Activity"
        />

        {open ? (
          <>
            {/*category selection dropdowns*/}
            <ActionLogCategorySelectionDropdowns
              categoryDropdownFormRef={categoryDropdownFormRef}
              setDisableSubmitBtn={setDisableSubmitBtn}
            />

            {/*category inputs*/}
            <ActionLogCategoryInputFields
              actionLogCategoriesInputs={actionLogCategoriesInputs}
              categoryInputsFormRef={categoryInputsFormRef}
            />

            {/*file upload*/}
            <ActionLogFileUpload
              fileUploadFormRef={fileUploadFormRef}
              disableSubmitBtn={disableSubmitBtn}
              setDisableSubmitBtn={setDisableSubmitBtn}
              handleSubmit={handleSubmit}
            />
          </>
        ) : null}
      </Box>
    </>
  );
};

export default ActionLog;
