import moment from "moment";
import { get } from "lodash";
import { Box } from "@mui/material";

export const opsEmpGetValue = (item, header) => {
  const value = get(item, header.value);
  if (header.computed && typeof header.computed === "function") {
    return header.computed(item, value);
  }

  //to return date in DD-MMM-YYYY format
  if (
    header.value === "dateOfBirth" ||
    header.value === "fromDate" ||
    header.value === "toDate" ||
    header.value === "dateOfAccreditation" ||
    header.value === "gapStartDate" ||
    header.value === "gapEndDate" ||
    header.value === "cessationDate"
  ) {
    //to return date in MM-YYYY format
    return moment(value).format("DD-MMM-YYYY");
  }

  if (
    header.value === "canContactEmployer" ||
    header.value === "wasBonusReceived" ||
    header.value === "isCurrentEmployer" ||
    header.value === "wasOnPayrollOfAgency" ||
    header.value === "wasResignationRequested"
  ) {
    if (value) return "Yes";
    return "No";
  }

  if (header.value === "EMPLOYMENT_DOCS") {
    return item?.attachments?.length ? (
      item?.attachments?.map((curr) =>
        curr.attachmentCategoryName === "EMPLOYMENT_DOCS" ? (
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

  if (header.value === "EMPLOYMENT_PAYSLIPS") {
    return item?.attachments?.length ? (
      item?.attachments?.map((curr) =>
        curr.attachmentCategoryName === "EMPLOYMENT_PAYSLIPS" ? (
          <div>
            <a target="_blank" href={curr.attachmentPath}>
              {curr.attachmentName}
            </a>
            <br />
          </div>
        ) : null
      )
    ) : (
      <span>No Files Attached</span>
    );
  }

  return value;
};
