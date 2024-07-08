import { Box } from "@mui/material";
import moment from "moment";
import { get } from "lodash";

export const opsGetValue = (item, header, title) => {
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
    header.value === "mothersMaidenNameExists"
  ) {
    if (value) return "Yes";
    return "No";
  }

  //to return date in MMM-YYYY format for address
  if (title?.includes("Address")) {
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
        item.answer.map((curr, index) =>
          curr?.answeroption
            ? index !== item.answer?.length - 1
              ? curr?.answeroption + " - " + curr?.rating + ", "
              : curr?.answeroption + " - " + curr?.rating
            : null
        )
      );
    } else {
      return item.answer !== "null"
        ? item?.answer?.replace('"', "").replace('"', "")
        : "";
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

  return value;
};
