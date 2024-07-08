import { FastField, Field } from "formik";
import {
  BaseCountrySelect,
  BaseDatePicker,
  BaseSelect,
  BaseTextField,
} from "../../../../../../../base";

export const verifierEducationFields = (qualificationTypes, educationTypes) => [
  {
    value: "nameOfSchoolCollegeUniversity",
    text: "Name of School/College/University",
    renderField: (index) => (
      <Field
        component={BaseTextField}
        name={`${index}.verifiedNameOfSchoolCollegeUniversity`}
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedNameOfSchoolCollegeUniversity`,
    verifiedFieldName: "verifiedNameOfSchoolCollegeUniversity",
  },
  {
    value: "countryName",
    text: "Country",
    renderField: (index) => (
      <Field
        component={BaseCountrySelect}
        name={`${index}.verifiedCountryId`}
      />
    ),
    getValueFieldName: "countryId",
    getSetFieldName: (index) => `${index}.verifiedCountryId`,
    verifiedFieldName: "verifiedCountryId",
  },
  {
    value: "fromDate",
    text: "From date",
    renderField: (index) => (
      <Field
        component={BaseDatePicker}
        name={`${index}.verifiedFromDate`}
        views={["year", "month", "day"]}
        placeholder="DD-MMM-YYYY"
        inputFormat="dd-MMM-yyyy"
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedFromDate`,
    verifiedFieldName: "verifiedFromDate",
    toRemoveTimeFromDate: true,
  },
  {
    value: "toDate",
    text: "To date",
    renderField: (index) => (
      <Field
        component={BaseDatePicker}
        name={`${index}.verifiedToDate`}
        views={["year", "month", "day"]}
        placeholder="DD-MMM-YYYY"
        inputFormat="dd-MMM-yyyy"
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedToDate`,
    verifiedFieldName: "verifiedToDate",
    toRemoveTimeFromDate: true,
  },
  {
    value: "qualificationTypeName",
    text: "Qualification type",
    renderField: (index) => (
      <FastField
        component={BaseSelect}
        name={`${index}.verifiedQualificationTypeId`}
        optionLabel="candidateEduQualificationTypeName"
        optionValue="candidateEduQualificationTypesId"
        options={qualificationTypes}
      />
    ),
    getValueFieldName: "qualificationTypeId",
    getSetFieldName: (index) => `${index}.verifiedQualificationTypeId`,
    verifiedFieldName: "verifiedQualificationTypeId",
  },
  {
    value: "titleOfQualification",
    text: "Title of qualification",
    renderField: (index) => (
      <Field
        component={BaseTextField}
        name={`${index}.verifiedTitleOfQualification`}
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedTitleOfQualification`,
    verifiedFieldName: "verifiedTitleOfQualification",
  },
  {
    value: "educationTypeName",
    text: "Education type",
    renderField: (index) => (
      <FastField
        component={BaseSelect}
        name={`${index}.verifiedEducationTypeId`}
        optionLabel="educationTypeName"
        optionValue="id"
        options={educationTypes}
      />
    ),
    getValueFieldName: "educationTypeId",
    getSetFieldName: (index) => `${index}.verifiedEducationTypeId`,
    verifiedFieldName: "verifiedEducationTypeId",
  },
];

export const verifierEducationExtraFieldsForPDF = [
  {
    value: "-",
    text: "Supplement Information",
    renderField: (index) => (
      <Field
        component={BaseTextField}
        name={`${index}.supplementInformation`}
      />
    ),
    verifiedFieldName: "supplementInformation",
  },
  {
    value: "-",
    text: "Accreditation Status",
    renderField: (index) => (
      <FastField
        component={BaseSelect}
        name={`${index}.accreditationStatus`}
        optionLabel="name"
        optionValue="name"
        options={[{ name: "Accredited" }, { name: "Non-Accredited" }]}
      />
    ),
    verifiedFieldName: "accreditationStatus",
  },
  {
    value: "-",
    text: "Accreditation Organization Name",
    renderField: (index) => (
      <Field
        component={BaseTextField}
        name={`${index}.accreditationOrganizationName`}
      />
    ),
    verifiedFieldName: "accreditationOrganizationName",
  },
  {
    value: "-",
    text: "Source",
    renderField: (index) => (
      <Field component={BaseTextField} name={`${index}.source`} />
    ),
    verifiedFieldName: "source",
  },
];
