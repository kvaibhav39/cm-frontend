import { Fragment } from "react";
import { get, isPlainObject } from "lodash";
import { Box, styled } from "@mui/material";
import moment from "moment";

const StyledTable = styled("table")`
  width: 100%;
  height: 100%;
  &,
  tr,
  th,
  td {
    border-collapse: collapse;
  }

  tr {
    th,
    td {
      padding: 1rem;
      text-align: left;
      font-size: 14px;
    }
    th {
      width: 40%;
      color: #565261;
      font-weight: 400;
    }
    td {
      width: 60%;
      font-weight: 500;
      color: #56535b;
      word-break: break-word;
    }
  }
  tr:not(:last-child) {
    border-bottom: 1px solid #d9d9d9;
  }
  th {
    border-right: 1px solid #d9d9d9;
  }
`;

const CandidateProfileReviewComponent = ({
  title,
  items,
  headers = [],
  itemHeader,
  numOfReferences,
  noOfProfessionalReference,
  ...props
}) => {
  let vendorUser =
    JSON.parse(
      JSON.parse(localStorage.getItem("first_login"))?.CheckMinistryUser
    )?.subRoleId === 11;

  const getValue = (item, header) => {
    const value = get(item, header.value);
    if (header.computed && typeof header.computed === "function") {
      return header.computed(item, value);
    }

    if (
      header.value === "otherNameExists" ||
      header.value === "formerNameExists" ||
      header.value === "nickNameExists" ||
      header.value === "isCurrentlyStudying" ||
      header.value === "isDistanceLearning" ||
      header.value === "mothersMaidenNameExists" ||
      header.value === "driverLicenseNumberExists" ||
      header.value === "DINNumberExists"
    ) {
      if (value) return "Yes";
      return "No";
    }

    if (
      header.value === "driverLicenseFrontCopy" ||
      header.value === "driverLicenseBackCopy"
    ) {
      return (
        <div>
          <a
            target="_blank"
            href={
              header.value === "driverLicenseFrontCopy"
                ? item.driverLicenseFrontCopy
                : item.driverLicenseBackCopy
            }
          >
            {header.value === "driverLicenseFrontCopy"
              ? "Front Side"
              : "Back Side"}
          </a>
        </div>
      );
    }

    if (header.value === "NickNameFirstName") {
      let { firstName, middleName, lastName } = item;
      return firstName + " " + middleName + " " + lastName;
    }

    //to return date in MMM-YYYY format for address
    if (title === "Address Details") {
      if (header.value === "fromDate" || header.value === "toDate") {
        return moment(value).format("MMM-YYYY");
      }
    } else if (
      header.value === "dateOfBirth" ||
      header.value === "formerNameDateChange" ||
      header.value === "fromDate" ||
      header.value === "toDate" ||
      header.value === "dateOfAccreditation"
    ) {
      return moment(value).format("DD-MMM-YYYY");
    }

    if (header.value === "mobileNumber") {
      return item.mobileNumber;
    }

    if (header.value === "canContactEmployer") {
      if (value) return "Yes";
      return "No";
    }

    //to display file upload of employment history & employment qualifications
    if (header.value === "EDUCATION_DOCS") {
      return item?.attachments?.length ? (
        item?.attachments?.map((curr) =>
          curr.attachmentCategoryName === "EDUCATION_DOCS" ? (
            <Box mb={item?.attachments?.length > 1 ? 1 : 0}>
              <a target="_blank" href={curr.attachmentPath}>
                {curr.attachmentName}
              </a>
              <br />
            </Box>
          ) : null
        )
      ) : (
        <span>No Files Attached</span>
      );
    }

    //to display file upload of proffessional qualifications
    if (header.value === "PROFESSIONAL_DOCS") {
      return item?.attachments?.length ? (
        item?.attachments?.map((curr) =>
          curr.attachmentCategoryName === "PROFESSIONAL_DOCS" ? (
            <Box mb={item?.attachments?.length > 1 ? 1 : 0}>
              <a target="_blank" href={curr.attachmentPath}>
                {curr.attachmentName}
              </a>
              <br />
            </Box>
          ) : null
        )
      ) : (
        <span>No Files Attached</span>
      );
    }

    if (header.value === "savedFormName") {
      return (
        <div>
          <a target="_blank" href={item.savedFormCdnPath}>
            {item.savedFormName}
          </a>
        </div>
      );
    }

    //DECLARATION
    if (header.value === "answer") {
      if (item.questionTypeName === "MULTI SELECT") {
        return (
          item?.answer?.length &&
          item?.answer?.map((curr, index) =>
            index !== item.answer?.length - 1 ? curr + ", " : curr
          )
        );
      } else if (item.questionTypeName === "RATING") {
        return (
          item.answer?.length &&
          item.answer.map((curr, index) => {
            let getRatingName = (rating) =>
              item?.candidateRefereeQuestionnairesQuestions?.answerChoice?.scales?.find(
                (curr) => curr?.scaleNumber === rating
              )?.scaleText;

            return (
              curr?.answeroption && (
                <>
                  {curr?.answeroption + " - " + getRatingName(curr?.rating)}

                  <br />
                </>
              )
            );
          })
        );
      } else if (item.questionTypeName === "Yes/No with Justification") {
        return `${item?.answer?.answeroption} ${
          item?.answer?.answeroption === "No"
            ? `, reason: ${item?.answer?.justification}`
            : ""
        }`;
      } else {
        return item.answer || "";
      }
    }

    if (header.value === "mobileNumber") {
      return item.institutePhoneCountryCode + " " + item.institutePhoneNumber;
    }

    //supporting documents
    if (
      header.value === "uploadedByCandidate" ||
      header.value === "uploadedByOpsUser" ||
      header.value === "uplodedByHr"
    ) {
      return (
        <>
          {item[header.value].map((obj) => {
            let uploadedFileName = "";
            let uploadedFilePath = "";

            for (var key in obj) {
              uploadedFileName = key;
              uploadedFilePath = obj[key];
            }

            return (
              <Box mb={item[header.value]?.length > 1 ? 1 : 0}>
                <a target="_blank" href={uploadedFilePath}>
                  {uploadedFileName}
                </a>
              </Box>
            );
          })}
        </>
      );
    }

    if (header.value === "identityAttachments") {
      return item?.identityAttachments?.length ? (
        item?.identityAttachments?.map((curr) => (
          <Box mb={item?.identityAttachments?.length > 1 ? 1 : 0}>
            <a target="_blank" href={curr.attachmentPath}>
              {curr.attachmentName}
            </a>
            <br />
          </Box>
        ))
      ) : (
        <span>No Files Attached</span>
      );
    }

    if (header?.value === "NotResponded") {
      return item[header.value] ? "Not Yet" : "Yes";
    }

    if (header?.value === "isDeclined") {
      return item[header.value] ? "Declined" : "Accepted";
    }

    return value;
  };

  const todisplayHeaders = (item, header) => {
    if (vendorUser) {
      if (
        header?.value === "personalEmail" ||
        header?.value === "mobileNumber"
      ) {
        return false;
      }
    }

    if (!item.otherNameExists) {
      if (header.text === "Other Names") {
        return false;
      }
    }

    if (item.otherNameLanguageId !== 185) {
      if (header.value === "pinyinName") {
        return false;
      }
    }

    if (!item.formerNameExists) {
      if (
        header.text === "Former Names" ||
        header.value === "formerName" ||
        header.value === "formerNameDateChange"
      ) {
        return false;
      }
    }

    if (!item.nickNameExists) {
      if (
        header.text === "Nick Names" ||
        header.value === "NickNameFirstName"
      ) {
        return false;
      }
    }

    if (!props.conditionToDisplayDriverLicenseFields) {
      if (header.value === "driverLicenseNumberExists") {
        return false;
      }
    }

    if (!item.driverLicenseNumberExists) {
      if (
        header.text === "Driver License Details" ||
        header.value === "driverLicenseNumber" ||
        header.value === "driverLicenseFrontCopy" ||
        header.value === "driverLicenseBackCopy"
      ) {
        return false;
      }
    }

    if (!props.conditionToDisplayDINnumberFields) {
      if (header.value === "DINNumberExists") {
        return false;
      }
    }

    if (!item.DINNumberExists) {
      if (
        header.text === "DIN Number Details" ||
        header.value === "DINNumber"
      ) {
        return false;
      }
    }

    if (!item.mothersMaidenNameExists) {
      if (header.value === "mothersMaidenName") {
        return false;
      }
    }

    if (!props.conditionToDisplaySpouseFields) {
      if (
        header.value === "spouseLastName" ||
        header.value === "spouseMiddleName" ||
        header.value === "spouseFirstName"
      ) {
        return false;
      }
    }

    if (title === "Address Details" && header.text.includes("State/Province")) {
      if (item.countryId === 101 || item.countryId === 132) {
        header.text = "State/Province";
      } else {
        header.text = "State/Province*";
      }
    }

    if (
      title === "Educational Qualification" &&
      header.text.includes("State/Province")
    ) {
      if (item.countryId === 101 || item.countryId === 132) {
        header.text = "State/Province";
      } else {
        header.text = "State/Province*";
      }
    }

    if (
      title === "Professional Qualification" &&
      header.text.includes("State/Province")
    ) {
      if (item.countryId === 101 || item.countryId === 132) {
        header.text = "State/Province";
      } else {
        header.text = "State/Province*";
      }
    }

    if (item.statusProfessionalQualificationId !== 4) {
      if (header.value === "otherProffesionalQualificationStatus") {
        return false;
      }
    }

    if (item.educationTypeId !== 3) {
      if (header.value === "otherEducationType") {
        return false;
      }
    }

    if (item.qualificationTypeId !== 8) {
      if (header.value === "qualificationTypeOthers") {
        return false;
      }
    }

    if (
      header.value === "uploadedByCandidate" ||
      header.value === "uploadedByOpsUser" ||
      header.value === "uplodedByHr" ||
      header.value === "identityAttachments"
    ) {
      return item[header.value]?.length;
    }

    if (
      header.value === "identityDocumentType" ||
      header.value === "identityDocumentNumber"
    ) {
      return item[header.value];
    }

    if (
      (item?.NotResponded || item?.isDeclined) &&
      header?.text === "Referee Answers"
    ) {
      return false;
    }

    if (
      item?.NotResponded &&
      (header?.value === "isDeclined" || header?.value === "reasonOfDecline")
    ) {
      return false;
    }

    if (
      !item?.NotResponded &&
      !item?.isDeclined &&
      header?.value === "reasonOfDecline"
    ) {
      return false;
    }

    return true;
  };

  return (
    <Box p={2} sx={{ maxHeight: "80vh", minHeight: "100%", overflow: "auto" }}>
      <StyledTable>
        <tbody>
          {numOfReferences ? (
            <tr>
              <th>Number of references provided for contact details*</th>
              <td>{numOfReferences}</td>
            </tr>
          ) : null}
          {noOfProfessionalReference ? (
            <tr>
              <th>Reason for not providing requested number of references*</th>
              <td>{noOfProfessionalReference}</td>
            </tr>
          ) : null}
          {Array.isArray(items)
            ? items.map((item, index) => (
                <Fragment key={index}>
                  {itemHeader(item, index).includes("Question") ? null : (
                    <tr>
                      <th>
                        <strong>
                          {itemHeader
                            ? itemHeader(item, index)
                            : `Item ${index + 1}`}
                        </strong>
                      </th>
                    </tr>
                  )}

                  {headers.map((header) => (
                    <>
                      {todisplayHeaders(item, header) ? (
                        <>
                          {header.headerArray ? (
                            <>
                              {get(item, header.value)?.map(
                                (displayValue, displayIndex) =>
                                  header?.headerValues.map(
                                    (headerValue, headerIndex) =>
                                      todisplayHeaders(
                                        displayValue,
                                        headerValue
                                      ) ? (
                                        <tr key={displayIndex}>
                                          <th colSpan={1}>
                                            {headerValue.text} -{" "}
                                            {displayIndex + 1}
                                          </th>
                                          <td>
                                            {getValue(
                                              displayValue,
                                              headerValue
                                            )}
                                          </td>
                                        </tr>
                                      ) : (
                                        <></>
                                      )
                                  )
                              )}
                            </>
                          ) : (
                            <tr key={header.value}>
                              <th
                                colSpan={header.heading ? 2 : 1}
                                style={
                                  header.heading ? { borderRight: "none" } : {}
                                }
                              >
                                {header.heading ? (
                                  <strong>
                                    {header.text.replace(
                                      "{{index}}",
                                      index + 1
                                    )}
                                  </strong>
                                ) : header.text !== "Question" ? (
                                  header.text
                                ) : (
                                  <strong>
                                    {itemHeader(item, index) + "*"}
                                  </strong>
                                )}
                              </th>
                              {!header.heading ? (
                                <td>{getValue(item, header)}</td>
                              ) : null}
                            </tr>
                          )}
                        </>
                      ) : null}
                    </>
                  ))}
                </Fragment>
              ))
            : null}
          {isPlainObject(items)
            ? headers.map((header) =>
                todisplayHeaders(items, header) ? (
                  <>
                    {header.headerArray ? (
                      <>
                        {get(items, header.value)?.map(
                          (displayValue, displayIndex) =>
                            header.headerValues.map(
                              (headerValue, headerIndex) =>
                                todisplayHeaders(displayValue, headerValue) ? (
                                  <tr key={displayIndex}>
                                    <th colSpan={1}>
                                      {headerValue.text} - {displayIndex + 1}
                                    </th>
                                    <td>
                                      {getValue(displayValue, headerValue)}
                                    </td>
                                  </tr>
                                ) : (
                                  <></>
                                )
                            )
                        )}
                      </>
                    ) : (
                      <tr key={header.value}>
                        <th
                          colSpan={header.heading ? 2 : 1}
                          style={header.heading ? { borderRight: "none" } : {}}
                        >
                          {header.heading ? (
                            <strong>{header.text}</strong>
                          ) : (
                            header.text
                          )}
                        </th>
                        {!header.heading ? (
                          <td>{getValue(items, header)}</td>
                        ) : null}
                      </tr>
                    )}
                  </>
                ) : null
              )
            : null}
        </tbody>
      </StyledTable>
    </Box>
  );
};

export default CandidateProfileReviewComponent;
