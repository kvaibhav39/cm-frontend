import { Form, Formik } from "formik";
import React, { useMemo } from "react";
import { actionLogInitialValues } from "../helper/actionLogInitialValues";
import { actionLogSchema } from "../helper/actionLogSchema";
import { Grid, Typography } from "@mui/material";
import { getInputFieldById } from "../utils/getInputFieldById";
import CircularLoader from "../../../../../../../../../../common/CircularLoader";

const ActionLogCategoryInputFields = ({
  actionLogCategoriesInputs,
  categoryInputsFormRef,
}) => {
  let displayCategoryInputFields = useMemo(() => {
    //looping over category inputs array and adding suitable component to display as per fieldTypeId
    actionLogCategoriesInputs?.forEach((catDetails) => {
      catDetails.inputFieldComponent = getInputFieldById(catDetails, "");

      //checking and addiing any extra field if present
      catDetails?.actionLogCategoryInputFieldsL1Data?.forEach(
        (catInputDetails) => {
          if (catInputDetails?.categoryInputFieldL2) {
            catInputDetails?.categoryInputFieldL2?.forEach((extraFieldData) => {
              extraFieldData.inputFieldComponent = getInputFieldById(
                catDetails,
                `${catDetails?.categoryInputName}-extraFields`,
                extraFieldData,
                catInputDetails?.id
              );
            });
          }
        }
      );
    });

    return actionLogCategoriesInputs;
  }, [actionLogCategoriesInputs]);

  return (
    <Formik
      enableReinitialize
      initialValues={actionLogInitialValues(actionLogCategoriesInputs)}
      validationSchema={actionLogSchema(actionLogCategoriesInputs)}
      innerRef={categoryInputsFormRef}
    >
      {(form) => (
        <Form>
          {/* {console.log("00000-values", form.values)}
          {console.log("00000-touched", form.touched)}
          {console.log("00000-errors", form.errors)} */}
          <Grid
            item
            xs={12}
            gap={2}
            my={2}
            display="flex"
            alignItems="flex-start"
            flexWrap="wrap"
          >
            {actionLogCategoriesInputs ? (
              displayCategoryInputFields?.map((curr) => (
                <>
                  <Grid item xs={2.8} key={curr.id}>
                    {curr?.inputFieldComponent(form)}
                  </Grid>

                  {curr?.actionLogCategoryInputFieldsL1Data?.map(
                    (innerField) => {
                      let toDisplayExtraFields = false;
                      //we will display extrafields only when that particular dropdown value is
                      //selected who has extra fields
                      if (
                        form?.values[curr?.categoryInputName] ===
                          innerField?.id &&
                        innerField?.categoryInputFieldL2
                      ) {
                        toDisplayExtraFields = true;
                      }
                      return (
                        toDisplayExtraFields && (
                          <>
                            <Typography
                              mt={4}
                              fontWeight={600}
                              textTransform="capitalize"
                            >
                              {innerField?.categoryInputFieldLabelName}
                            </Typography>
                            {innerField?.categoryInputFieldL2?.map(
                              (extraFieldData, ind) => (
                                <Grid
                                  item
                                  xs={2.8}
                                  key={ind}
                                  textTransform="capitalize"
                                >
                                  {extraFieldData?.inputFieldComponent(form)}
                                </Grid>
                              )
                            )}
                          </>
                        )
                      );
                    }
                  )}
                </>
              ))
            ) : (
              <CircularLoader height="7vh" size={30} />
            )}
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ActionLogCategoryInputFields;
