import { FastField, FieldArray } from "formik";
import React, { Fragment } from "react";
import DisplayHeadingForMultipleFields from "../../common/DisplayHeadingForMultipleFields";
import { Box, Grid, Typography } from "@mui/material";
import { BaseCountrySelect, BaseSelect, BaseTextField } from "../../../base";
import { PhoneNumberTextField } from "../../../../common/Form/PhoneNumberTextField/PhoneNumberTextField";

const ProfessionalReferencesFormDetails = ({
  form,
  pushNewReference,
  professionalRelationsTypes,
  runWhenDelete
}) => {
  return (
    <FieldArray name="references">
      {({ push, remove }) => {
        pushNewReference.current = push;
        return form.values.references?.length ? (
          <>
            {form.values.references.map((reference, index) =>
              reference.selectedTab ? (
                <Fragment key={index}>
                  <DisplayHeadingForMultipleFields
                    index={index}
                    heading="Professional Reference"
                    currentValue={reference}
                    sectionValues={form?.values?.references}
                    fieldArrayName="references"
                    setFieldValue={form.setFieldValue}
                    runWhenDelete={runWhenDelete}
                  />

                  <Box px={3} mb={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <FastField
                          component={BaseTextField}
                          label="Full Name*"
                          name={`references.${index}.fullName`}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <FastField
                          component={BaseTextField}
                          label="Title*"
                          name={`references.${index}.title`}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FastField
                          component={BaseTextField}
                          label="Company Name*"
                          name={`references.${index}.companyName`}
                        />
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <FastField
                          component={BaseSelect}
                          label="Professional Relationship With Referee*"
                          name={`references.${index}.professionalRelationshipId`}
                          optionLabel="professionalRelationshipName"
                          optionValue="candidatesProfessionalReferencesRelationshipsId"
                          options={professionalRelationsTypes}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FastField
                          component={BaseTextField}
                          label="City"
                          name={`references.${index}.city`}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FastField
                          component={BaseCountrySelect}
                          label="Country*"
                          name={`references.${index}.countryId`}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FastField
                          component={BaseTextField}
                          label="Email*"
                          name={`references.${index}.email`}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography
                          varient="span"
                          sx={{
                            marginBottom: "4px",
                          }}
                        >
                          Phone / Contact Number*
                        </Typography>
                        <FastField
                          name={`references.${index}.referencePhoneNumber`}
                          codeName={`references.${index}.referencePhoneCountryCode`}
                          placeholder="Phone/Contact Number"
                          className="round_phone"
                          component={PhoneNumberTextField}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FastField
                          component={BaseTextField}
                          multiline
                          rows={3}
                          label="Any Additional Comments (within 250 words)"
                          name={`references.${index}.additionalComments`}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Fragment>
              ) : null
            )}
          </>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography align="center" fontWeight={550} p={2}>
              No Professional Reference Present
            </Typography>
          </Box>
        );
      }}
    </FieldArray>
  );
};

export default ProfessionalReferencesFormDetails;
