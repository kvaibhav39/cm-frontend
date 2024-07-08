import { FastField, Field, Formik } from "formik";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Grid,
  Typography,
  Box,
  Switch,
  InputAdornment,
  IconButton,
} from "@mui/material";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { BaseSelect, BaseTextField } from "../../../base";
import { customFieldsSchema } from "../../helpers/Schema/CustomFields";
import { customFieldsInitialValues } from "../../helpers/InitialValues/CustomFields";
import { DeleteOutline } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { InputTextField } from "../../../../common/Form/InputTextField/InputTextField";
import _ from "lodash";
import { submitCustomField } from "../../../../store/actions/systemAdminActions";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  min-width: 500px;
  min-height: 250px;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AddCustomFieldModal = ({ open, handleClose }) => {
  const [errorSubmit, setErrorSubmit] = useState(null);
  const { customFieldCategoriesLists, customFieldTypesLists } = useSelector(
    (state) => state.systemAdmin
  );
  const { selectedOrg } = useSelector((state) => state.systemAdmin);
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    setErrorSubmit(null);
    let flag = false;
    if (values.fieldType === 2) {
      //checking if all the fields are filled or not
      if (values.customFieldValues.includes("")) {
        setErrorSubmit("Please fill all the fields!");
        flag = true;
        return;
      }

      //checking if any of the fields have the same values
      values.customFieldValues.forEach((curr, index) => {
        if (values.customFieldValues.includes(curr, index + 1)) {
          setErrorSubmit("You have entered same dropdown values");
          flag = true;
          return;
        }
      });
    }

    if (!flag) {
      let postData = {
        customFieldCategoryId: values.fieldCategory,
        customFieldTypeId: values.fieldType,
        customFieldName: values.fieldName,
        customFieldDescription: values.fieldDescription,
        isMandatory: values.isMandatory,
        customFieldValues: values.customFieldValues,
      };

      if (values.fieldType === 1) {
        delete postData.customFieldValues;
      }

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleSubmit"
      );

      dispatch(submitCustomField(postData, selectedOrg, logDetails));
      handleClose();
    }
  };

  const handleDropdownAdd = (form) => {
    setErrorSubmit(null);
    form.setFieldValue("customFieldValues", [
      ...form.values.customFieldValues,
      "",
    ]);
  };

  const handleDropdownDelete = (form, i) => {
    setErrorSubmit(null);
    if (form.values.customFieldValues?.length === 1) {
      return;
    }

    let temp = form.values.customFieldValues.filter((_, index) => index !== i);

    form.setFieldValue("customFieldValues", temp);
  };

  return (
    <Formik
      initialValues={customFieldsInitialValues}
      validationSchema={customFieldsSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(form) => (
        <Dialog open={open} onClose={handleClose}>
          {/* {console.log("form", form.values)} */}
          <HrModalBox>
            <DialogTitle>
              <Typography variant="h2" style={{ fontWeight: "normal" }}>
                Add a New Field
              </Typography>
            </DialogTitle>
            <StyledDialogContent>
              <FastField
                component={BaseSelect}
                name="fieldCategory"
                label="Select Category*"
                optionLabel="fieldCategoryName"
                optionValue="id"
                options={customFieldCategoriesLists}
              />
              <Grid
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item xs={9.5}>
                  <FastField
                    component={BaseSelect}
                    name="fieldType"
                    label="Select Type*"
                    optionLabel="fieldTypeName"
                    optionValue="id"
                    options={customFieldTypesLists}
                  />
                </Grid>
                <Grid
                  item
                  xs={2}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Typography variant="h5" textAlign="center">
                    Mandatory?
                  </Typography>
                  <Switch
                    name="isMandatory"
                    checked={form.values.isMandatory}
                    size="small"
                    onChange={() => {
                      form.setFieldValue(
                        "isMandatory",
                        !form.values.isMandatory
                      );
                    }}
                  />
                </Grid>
              </Grid>
              {form.values.fieldType === 2 ? (
                <>
                  <Grid
                    container
                    xs={12}
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    direction={{ xs: "column", sm: "row" }}
                    sx={{
                      padding: "0 1rem",
                    }}
                  >
                    {form.values.customFieldValues.map((choice, i) => (
                      <Grid item xs={11} sm={4} key={i}>
                        <Field
                          name={`customFieldValues[${i}]`}
                          label="value"
                          inputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => handleDropdownDelete(form, i)}
                                  edge="end"
                                  color="error"
                                >
                                  <DeleteOutline />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          required
                          component={InputTextField}
                        />
                      </Grid>
                    ))}
                    <Grid item xs={1}>
                      <Button
                        variant="contained"
                        onClick={() => handleDropdownAdd(form)}
                      >
                        <AddIcon />
                      </Button>
                    </Grid>
                  </Grid>
                  {errorSubmit ? (
                    <Box>
                      <Typography
                        variant="h6"
                        color="red"
                        fontSize="14px"
                        padding="1rem"
                        textAlign="center"
                      >
                        {errorSubmit}
                      </Typography>
                    </Box>
                  ) : null}
                </>
              ) : null}

              <FastField
                component={BaseTextField}
                name="fieldName"
                label="Field Name*"
              />
              <FastField
                component={BaseTextField}
                multiline
                rows={3}
                label="Field Description"
                name="fieldDescription"
              />
            </StyledDialogContent>
            <DialogActions>
              <Button variant="standard" onClick={handleClose} disableElevation>
                Cancel
              </Button>
              <Button
                variant="outlined"
                style={{
                  backgroundColor: "#527AFB",
                  color: "#fff",
                  paddingLeft: "30px",
                  paddingRight: "30px",
                  marginLeft: "20px",
                  border: "1px solid #527AFB",
                }}
                type="submit"
                disableElevation
                onClick={form.submitForm}
              >
                Add{" "}
              </Button>
            </DialogActions>
          </HrModalBox>
        </Dialog>
      )}
    </Formik>
  );
};

export default AddCustomFieldModal;
