import { FastField, Formik, setNestedObjectValues } from "formik";
import React, { useEffect, useMemo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  Grid,
  Typography,
  Box,
  FormControl,
  List,
  ListItem,
  FormGroup,
} from "@mui/material";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { BaseSelect } from "../../../base";

import _ from "lodash";
import {
  getCustomEmailCategories,
  postAdditionalEmailDetails,
  putAdditionalEmailDetails,
} from "../../../../store/actions/systemAdminActions";
import { CustomCheckbox } from "../../../common/CustomCheckBox";

import MultipleUserSelectionDropdown from "./innerComponents/MultipleUserSelectionDropdown";
import MultipleOtherUsersTextFields from "./innerComponents/MultipleOtherUsersTextFields";
import { additionalEmailSettingsSchema } from "../../helpers/Schema/AdditionalEmailSettings";
import ReminderFrequency from "./innerComponents/ReminderFrequency";
import { convertFrequencyArrayIntoObject } from "../../utils/convertFrequencyArrayIntoObject";
import { frequencyUnits } from "./../../constants/frequencyUnits";
import CircularLoader from "./../../../../common/CircularLoader";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  min-width: 50vw;
  min-height: 70vh;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const AddAdditionalEmailSettingsModal = ({
  open,
  handleClose,
  editDetailsFlag = false,
  selectedEmailSettings = null,
}) => {
  const {
    selectedOrg,
    additionalEmailSettingsData,
    customEmailCategoriesLists,
  } = useSelector((state) => state.systemAdmin);
  const dispatch = useDispatch();

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getCustomEmailCategories({ isSchedulable: 1 }, logDetails));
  }, []);

  let checkboxesFields = useMemo(
    () => [
      { label: "Candidate", fieldName: "candidate" },
      {
        label: "HR",
        fieldName: "hr",
        displayExtraField: (props) => (
          <MultipleUserSelectionDropdown extraFieldFlag="HR" {...props} />
        ),
        toHideCheckBox: !selectedOrg,
      },
      {
        label: "OPS",
        fieldName: "ops",
        displayExtraField: (props) => (
          <MultipleUserSelectionDropdown extraFieldFlag="OPS" {...props} />
        ),
      },
      {
        label: "Other",
        fieldName: "other",
        displayExtraField: (props) => (
          <MultipleOtherUsersTextFields {...props} />
        ),
      },
    ],
    [selectedOrg]
  );

  let emailReceiversParams = [
    { title: "TO", value: "toSettings", checkboxesFields },
    { title: "CC", value: "ccSettings", checkboxesFields },
    { title: "BCC", value: "bccSettings", checkboxesFields },
  ];

  let additionalEmailSettingsInitialValues = useMemo(() => {
    let obj = {
      emailCategoryId: null,
      frequency: [{ value: null, unit: null }],
      toSettings: { candidate: false, hr: null, ops: null, other: null },
      ccSettings: { candidate: false, hr: null, ops: null, other: null },
      bccSettings: { candidate: false, hr: null, ops: null, other: null },
    };

    if (editDetailsFlag && selectedEmailSettings) {
      //for update api
      obj.frequency = convertFrequencyArrayIntoObject(
        selectedEmailSettings?.frequency
      );

      obj.emailCategoryId = selectedEmailSettings?.emailCategoryId;

      emailReceiversParams?.forEach((param) => {
        param?.checkboxesFields?.forEach((field) => {
          if (selectedEmailSettings[`${param?.value}Data`]) {
            obj[param?.value][field?.fieldName] =
              selectedEmailSettings[`${param?.value}Data`][field?.fieldName];
          }
        });
      });
    }

    return obj;
  }, [additionalEmailSettingsData]);

  const handleSubmit = (values) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    let freqInHours = [];
    values?.frequency?.forEach((freq) => {
      let selectedFreqInHoursMultiplier = frequencyUnits?.find(
        (curr) => curr.unitVal === freq.unit
      )?.inHours;
      freqInHours.push(freq.value * selectedFreqInHoursMultiplier);
    });

    let payload = { ...values, frequency: freqInHours };

    if (editDetailsFlag && selectedEmailSettings) {
      dispatch(
        putAdditionalEmailDetails(
          payload,
          selectedOrg,
          selectedEmailSettings?.id,
          logDetails
        )
      );
    } else {
      dispatch(postAdditionalEmailDetails(payload, selectedOrg, logDetails));
    }

    handleClose();
  };

  const handleToggleCheckBoxes = (
    param,
    field,
    values,
    setFieldValue,
    setTouched
  ) => {
    setFieldValue(`${param}`, {
      ...values[param],
      [field]: Array.isArray(values[param][field])
        ? null
        : values[param][field] === null
        ? field === "other"
          ? [""]
          : []
        : !values[param][field],
    });
    setTouched(setNestedObjectValues(values, false));
  };

  return (
    <Formik
      enableReinitialize
      initialValues={additionalEmailSettingsInitialValues}
      validationSchema={additionalEmailSettingsSchema(emailReceiversParams)}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, submitForm, errors, touched, setTouched }) => (
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth={false}
        >
          <HrModalBox>
            {customEmailCategoriesLists ? (
              <>
                <StyledDialogContent>
                  <Grid
                    container
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Grid item xs={12} md={6}>
                      <FastField
                        component={BaseSelect}
                        name="emailCategoryId"
                        label="Select Category*"
                        optionLabel="emailCategoryName"
                        optionValue="id"
                        options={customEmailCategoriesLists}
                        disable={editDetailsFlag && selectedEmailSettings}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} my={2}>
                      <Typography
                        fontWeight={550}
                        color={(theme) => theme.palette.grey[700]}
                        textAlign="center"
                      >
                        Reminder Frequency
                      </Typography>{" "}
                      <ReminderFrequency
                        fieldName="frequency"
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} width="100%">
                      {emailReceiversParams?.map((param, index) => (
                        <FormControl fullWidth size="small" key={index}>
                          <Box
                            color={(theme) => theme.palette.grey[700]}
                            fontWeight="bold"
                            textAlign="center"
                          >
                            {param.title}
                          </Box>
                          <List
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              flexDirection: "column",
                              flexWrap: "wrap",
                            }}
                          >
                            {param?.checkboxesFields?.map((field, ind) =>
                              !field?.toHideCheckBox ? (
                                <>
                                  <ListItem
                                    key={ind}
                                    sx={{
                                      width: "auto",
                                      maxWidth: {
                                        xs: "250px",
                                        md: "max-content",
                                      },
                                    }}
                                  >
                                    <FormGroup
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        // width: "max-content",
                                        flexDirection: "row",
                                      }}
                                    >
                                      <CustomCheckbox
                                        type="checkbox"
                                        id={`check-checkbox-${param?.value}${field?.fieldName}`}
                                        name={[param?.value][field?.fieldName]}
                                        value={
                                          values[param?.value][field?.fieldName]
                                            ? true
                                            : false
                                        }
                                        checked={
                                          values[param?.value][field?.fieldName]
                                            ? true
                                            : false
                                        }
                                        onChange={() =>
                                          handleToggleCheckBoxes(
                                            param?.value,
                                            field?.fieldName,
                                            values,
                                            setFieldValue,
                                            setTouched
                                          )
                                        }
                                      />
                                      <label
                                        htmlFor={`check-checkbox-${param?.value}${field?.fieldName}`}
                                      >
                                        {" "}
                                        <Typography
                                          variant="body2"
                                          mr={1}
                                          sx={{
                                            fontSize: "12px",
                                          }}
                                        >
                                          {field?.label}
                                        </Typography>
                                      </label>
                                    </FormGroup>
                                  </ListItem>
                                  {/*hr , ops & other checkbox fields */}
                                  {values[param?.value][field?.fieldName] &&
                                  field?.displayExtraField ? (
                                    <Box my={1}>
                                      {field?.displayExtraField({
                                        values,
                                        errorMsg:
                                          errors &&
                                          errors[param?.value] &&
                                          touched &&
                                          touched[param?.value] &&
                                          touched[param?.value][
                                            field?.fieldName
                                          ] &&
                                          errors[param?.value][
                                            field?.fieldName
                                          ],
                                        param: param?.value,
                                        fieldName: field?.fieldName,
                                        setFieldValue,
                                      })}
                                    </Box>
                                  ) : null}
                                </>
                              ) : null
                            )}
                          </List>
                        </FormControl>
                      ))}
                    </Grid>
                  </Grid>
                </StyledDialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClose}
                    disableElevation
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color={
                      editDetailsFlag && selectedEmailSettings
                        ? "warning"
                        : "primary"
                    }
                    type="submit"
                    disableElevation
                    onClick={submitForm}
                  >
                    {editDetailsFlag && selectedEmailSettings
                      ? "Update"
                      : "Add"}{" "}
                  </Button>
                </DialogActions>{" "}
              </>
            ) : (
              <Box height="75vh">
                <CircularLoader height="100%" size={50} />
              </Box>
            )}
          </HrModalBox>
        </Dialog>
      )}
    </Formik>
  );
};

export default AddAdditionalEmailSettingsModal;
