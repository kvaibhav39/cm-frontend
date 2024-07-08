import { FastField, FieldArray } from "formik";
import DisplayHeadingForMultipleFields from "../../common/DisplayHeadingForMultipleFields";
import { Box, Divider, Grid, Typography } from "@mui/material";
import {
  BaseCountrySelect,
  BaseDatePicker,
  BaseSelect,
  BaseTextField,
} from "../../../base";
import { InsertDriveFileOutlined, PlaceOutlined } from "@mui/icons-material";
import { PhoneNumberTextField } from "../../../../common/Form/PhoneNumberTextField/PhoneNumberTextField";
import BaseUploadNew from "../../../base/BaseUploadNew";
import { addAndRemoveImageHanlderArray } from "../../utils/addAndRemoveImageHandlerArray";
import { useDispatch } from "react-redux";

const ProfessionalFormDetails = ({
  form,
  pushNewProfRef,
  qualificationStatuses,
  professionalForm,
  setDisableBtn,
  attachFileErr,
  setAttachFileErr,
}) => {
  const dispatch = useDispatch();
  return (
    <FieldArray name="qualifications">
      {({ push, remove }) => {
        pushNewProfRef.current = push;
        return (
          <>
            {form.values.qualifications?.length ? (
              <>
                {form.values.qualifications.map((qualification, index) =>
                  qualification.selectedTab ? (
                    <>
                      <DisplayHeadingForMultipleFields
                        index={index}
                        heading=" Professional Qualification"
                        currentValue={qualification}
                        sectionValues={form?.values?.qualifications}
                        fieldArrayName="qualifications"
                        setFieldValue={form.setFieldValue}
                      />

                      <Box px={3}>
                        <Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <FastField
                                component={BaseTextField}
                                name={`qualifications.${index}.professionalQualificationTitle`}
                                label="Professional Qualification Title*"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <FastField
                                component={BaseTextField}
                                name={`qualifications.${index}.qualifyingInstituteBodyName`}
                                label="Qualifying Institute/Body Name*"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <FastField
                                component={BaseSelect}
                                options={qualificationStatuses}
                                label="Status of Your Professional Qualification*"
                                optionLabel="statusProfessionalQualificationName"
                                optionValue="candidatesProfessionalQualificationsStatusId"
                                name={`qualifications.${index}.statusProfessionalQualificationId`}
                              />
                            </Grid>
                            {qualification.statusProfessionalQualificationId ===
                            4 ? (
                              <Grid item xs={12} md={6}>
                                <FastField
                                  component={BaseTextField}
                                  name={`qualifications.${index}.otherProffesionalQualificationStatus`}
                                  label="Other Qualification Status*"
                                />
                              </Grid>
                            ) : null}
                            <Grid item xs={12} md={6}>
                              <FastField
                                component={BaseTextField}
                                name={`qualifications.${index}.membershipQualificationNumber`}
                                label="Membership/Qualification Number"
                              />
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <FastField
                                component={BaseDatePicker}
                                name={`qualifications.${index}.fromDate`}
                                label="From Date*"
                                views={["year", "month", "day"]}
                                placeholder="DD-MMM-YYYY"
                                inputFormat="dd-MMM-yyyy"
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <FastField
                                component={BaseDatePicker}
                                name={`qualifications.${index}.toDate`}
                                label="To Date*"
                                views={["year", "month", "day"]}
                                placeholder="DD-MMM-YYYY"
                                inputFormat="dd-MMM-yyyy"
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <FastField
                                component={BaseDatePicker}
                                name={`qualifications.${index}.dateOfAccreditation`}
                                label="Date of Accreditation*"
                                views={["year", "month", "day"]}
                                placeholder="DD-MMM-YYYY"
                                inputFormat="dd-MMM-yyyy"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FastField
                                rows={4}
                                multiline
                                component={BaseTextField}
                                name={`qualifications.${index}.additionalComments`}
                                label="Any Additional Comments (within 250 words)"
                              />
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Address Of Institute/ Body */}
                        <Box>
                          <Box my={3} px={3}>
                            <Divider />
                          </Box>

                          <Box
                            mt={3}
                            display={"flex"}
                            alignItems="center"
                            className="space-x-2"
                          >
                            <PlaceOutlined />
                            <Typography fontSize={"20px"} fontWeight="500">
                              Address Of Institute/ Body
                            </Typography>
                          </Box>
                          <Box mt={3}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <FastField
                                  component={BaseTextField}
                                  name={`qualifications.${index}.streetAddressLine1`}
                                  label="Address Line 1*"
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <FastField
                                  component={BaseTextField}
                                  name={`qualifications.${index}.streetAddressLine2`}
                                  label="Address Line 2"
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <FastField
                                  component={BaseTextField}
                                  name={`qualifications.${index}.cityTownDistrict`}
                                  label="City/Town/District*"
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <FastField
                                  component={BaseTextField}
                                  name={`qualifications.${index}.stateProvince`}
                                  shouldUpdate={() => true}
                                  label={
                                    form?.values?.qualifications[index]
                                      ?.countryId === 101 ||
                                    form?.values?.qualifications[index]
                                      ?.countryId === 132
                                      ? "State/Province"
                                      : "State/Province*"
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <FastField
                                  component={BaseCountrySelect}
                                  name={`qualifications.${index}.countryId`}
                                  label="Country*"
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <FastField
                                  component={BaseTextField}
                                  name={`qualifications.${index}.zipPostalAreaCode`}
                                  label="Zip/Postal/Area Code"
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography
                                  varient="h5"
                                  sx={{
                                    marginBottom: "4px",
                                  }}
                                >
                                  Phone Number
                                </Typography>
                                <FastField
                                  name={`qualifications.${index}.institutePhoneNumber`}
                                  placeholder="Your phone number"
                                  className="round_phone"
                                  component={PhoneNumberTextField}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>

                        {/* Supporting Documents */}
                        <Box mb={3}>
                          <Box my={3} px={3}>
                            <Divider />
                          </Box>

                          <Box
                            mt={3}
                            display={"flex"}
                            alignItems="center"
                            className="space-x-2"
                          >
                            <InsertDriveFileOutlined />
                            <Typography fontSize={"20px"} fontWeight="500">
                              Supporting Documents*
                            </Typography>
                          </Box>

                          <BaseUploadNew
                            multiple
                            mt={3}
                            label="Please attach the copy of your Professional Qualification/License for Verification"
                            onChange={(files, delObj, delAll) =>
                              addAndRemoveImageHanlderArray({
                                files,
                                delObj,
                                delAll,
                                form,
                                refForm: professionalForm,
                                index,
                                keyForArray: "qualifications",
                                categoryName: "PROFESSIONAL_DOCS",
                                dispatch,
                                setDisableBtn,
                              })
                            }
                            categoryName="PROFESSIONAL_DOCS"
                            id={`accordion${form.values.qualifications.length}`}
                            uploadFiles={qualification?.attachments}
                            form={form}
                            name={`qualifications.${index}.attachments`}
                            checkName={`qualifications.${index}.attachments`}
                            attachFileErr={attachFileErr}
                            setAttachFileErr={setAttachFileErr}
                            key={index}
                            setDisableBtn={setDisableBtn}
                          />
                        </Box>
                      </Box>
                    </>
                  ) : null
                )}

                {/* Add More Professional Qualification */}
                {/* <Stack
                  my={3}
                  px={3}
                  spacing={3}
                  direction={{ xs: "column", md: "row" }}
                >
                  <FormControlLabel
                    control={<Checkbox />}
                    label="That's All, I don't have any other Professional Qualification"
                  />
                </Stack> */}
              </>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography align="center" fontWeight={550} p={2}>
                  No Professional Qualification Present
                </Typography>
              </Box>
            )}
          </>
        );
      }}
    </FieldArray>
  );
};

export default ProfessionalFormDetails;
