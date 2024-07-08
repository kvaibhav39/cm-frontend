import { FastField, FieldArray } from "formik";
import DisplayHeadingForMultipleFields from "../../common/DisplayHeadingForMultipleFields";
import {
  Box,
  Grid,
  Typography,
  Divider
} from "@mui/material";
import {
  BaseCountrySelect,
  BaseDatePicker,
  BaseSelect,
  BaseSwitchCard,
  BaseTextField,
} from "../../../base";
import { PhoneNumberTextField } from "../../../../common/Form/PhoneNumberTextField/PhoneNumberTextField";
import { InfoOutlined, InsertDriveFileOutlined } from "@mui/icons-material";
import CustomTooltip from "../../../common/CustomTooltip";
import BaseUploadNew from "../../../base/BaseUploadNew";
import { addAndRemoveImageHanlderArray } from "../../utils/addAndRemoveImageHandlerArray";
import { useDispatch } from "react-redux";

const EducationFormDetails = ({
  form,
  pushNewEduRef,
  educationForm,
  qualificationTypes,
  educationTypes,
  setDisableBtn,
  attachFileErr,
  setAttachFileErr,
  sectionData,
}) => {
  const dispatch = useDispatch();
  return (
    <FieldArray name="qualifications" id="qualifications">
      {({ push, remove }) => {
        pushNewEduRef.current = push;
        return (
          <>
            {form.values.qualifications?.length ? (
              <>
                {form.values.qualifications.map((qualification, index) =>
                  qualification.selectedTab ? (
                    <>
                      <DisplayHeadingForMultipleFields
                        index={index}
                        heading="Education Qualification"
                        currentValue={qualification}
                        sectionValues={form?.values?.qualifications}
                        fieldArrayName="qualifications"
                        setFieldValue={form.setFieldValue}
                      />

                      <Grid container px={3} spacing={2}>
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
                        <Grid item xs={12} md={6}>
                          <FastField
                            component={BaseTextField}
                            name={`qualifications.${index}.nameOfSchoolCollegeUniversity`}
                            label="Name of School/College/University*"
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
                              form?.values?.qualifications[index]?.countryId ===
                                101 ||
                              form?.values?.qualifications[index]?.countryId ===
                                132
                                ? "State/Province"
                                : "State/Province*"
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FastField
                            component={BaseTextField}
                            name={`qualifications.${index}.zipPostalAreaCode`}
                            label="Zip/Postal/Area Code"
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FastField
                            component={BaseCountrySelect}
                            name={`qualifications.${index}.countryId`}
                            label="Country*"
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
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

                      {/* HR Details	  */}
                      <Box>
                        <Box my={3} px={3}>
                          <Divider />
                        </Box>

                        <Box
                          mt={3}
                          px={3}
                          display={"flex"}
                          alignItems="center"
                          className="space-x-2"
                        >
                          <InsertDriveFileOutlined />
                          <Typography fontSize={"20px"} fontWeight="500">
                            Program / Study Details
                          </Typography>
                        </Box>
                        <Box px={3} mt={3}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <FastField
                                    component={BaseSelect}
                                    name={`qualifications.${index}.qualificationTypeId`}
                                    label="Type Of Qualification*"
                                    optionLabel="candidateEduQualificationTypeName"
                                    optionValue="candidateEduQualificationTypesId"
                                    options={qualificationTypes}
                                  />
                                </Grid>

                                {qualification?.qualificationTypeId === 8 ? (
                                  <Grid item xs={12}>
                                    <FastField
                                      component={BaseTextField}
                                      name={`qualifications.${index}.qualificationTypeOthers`}
                                      label="Other Qualification*"
                                    />
                                  </Grid>
                                ) : null}
                                <Grid
                                  item
                                  xs={12}
                                  display="flex"
                                  alignItems="center"
                                >
                                  <FastField
                                    component={BaseTextField}
                                    name={`qualifications.${index}.titleOfQualification`}
                                    label="Title of Qualification*"
                                  />
                                  <CustomTooltip
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "16px",
                                    }}
                                    title="eg. Bachelor of Law/Art/Science/Engineering"
                                    tooltipmaxwidth={320}
                                  >
                                    <InfoOutlined />
                                  </CustomTooltip>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  display="flex"
                                  alignItems="center"
                                >
                                  <FastField
                                    component={BaseTextField}
                                    name={`qualifications.${index}.specilization`}
                                    label="Specialization of Your Qualification*"
                                  />
                                  <CustomTooltip
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "16px",
                                    }}
                                    title="eg. Finance/Marketing/Data Science"
                                  >
                                    <InfoOutlined />
                                  </CustomTooltip>
                                </Grid>
                                <Grid item xs={12}>
                                  <FastField
                                    component={BaseSelect}
                                    name={`qualifications.${index}.educationTypeId`}
                                    label="Education Type*"
                                    optionLabel="educationTypeName"
                                    optionValue="id"
                                    options={educationTypes}
                                    index={index}
                                  />
                                </Grid>
                                {qualification?.educationTypeId === 3 ? (
                                  <Grid item xs={12}>
                                    <FastField
                                      component={BaseTextField}
                                      name={`qualifications.${index}.otherEducationType`}
                                      label="Other Education Type*"
                                    />
                                  </Grid>
                                ) : null}
                              </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <FastField
                                    component={BaseSwitchCard}
                                    name={`qualifications.${index}.isCurrentlyStudying`}
                                    box={{ mt: 1.5 }}
                                    label="Are you currently studying this qualification?"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <FastField
                                    component={BaseDatePicker}
                                    name={`qualifications.${index}.fromDate`}
                                    label="From Date*"
                                    views={["year", "month", "day"]}
                                    placeholder="DD-MMM-YYYY"
                                    inputFormat="dd-MMM-yyyy"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <FastField
                                    component={BaseDatePicker}
                                    name={`qualifications.${index}.toDate`}
                                    label="To Date*"
                                    views={["year", "month", "day"]}
                                    placeholder="DD-MMM-YYYY"
                                    inputFormat="dd-MMM-yyyy"
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <FastField
                                    component={BaseTextField}
                                    name={`qualifications.${index}.gradePercentageGpaScore`}
                                    label="Grade/Percentage/GPA Score*"
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <FastField
                                    component={BaseTextField}
                                    name={`qualifications.${index}.certificateNo`}
                                    label="Certificate No*"
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <FastField
                                    component={BaseTextField}
                                    name={`qualifications.${index}.studentEnrollmentNo`}
                                    label="Student No/Enrollment No*"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <FastField
                                component={BaseTextField}
                                name={`qualifications.${index}.additionalComments`}
                                rows={4}
                                multiline
                                label="Any Additional Comments (within 250 words)"
                              />
                            </Grid>
                          </Grid>
                        </Box>
                        <Box my={3} px={3}>
                          <Divider />
                        </Box>
                      </Box>

                      {/* Supporting Documents */}
                      <Box my={3}>
                        <Box
                          px={3}
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
                          mx={3}
                          mt={3}
                          label="Please attach your Educations Degree/Marksheet/Any Other relevant proofs"
                          onChange={(files, delObj, delAll) =>
                            addAndRemoveImageHanlderArray({
                              files,
                              delObj,
                              delAll,
                              form,
                              refForm: educationForm,
                              index,
                              keyForArray: "qualifications",
                              categoryName: "EDUCATION_DOCS",
                              dispatch,
                              setDisableBtn,
                            })
                          }
                          categoryName="EDUCATION_DOCS"
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
                    </>
                  ) : null
                )}
                {/* Add Next Education */}
                {/* {sectionData?.section?.validationScope?.noOfEducations >
                educationForm.current?.values?.qualifications?.length ? (
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 2, md: 4 }}
                    my={3}
                    px={3}
                  >
                    <FormControlLabel
                      control={<Checkbox />}
                      label="That's All, I don't have any other education qualification"
                    />
                  </Stack>
                ) : null} */}
              </>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography align="center" fontWeight={550} p={2}>
                  No Educations Present
                </Typography>
              </Box>
            )}
          </>
        );
      }}
    </FieldArray>
  );
};

export default EducationFormDetails;
