import { Fragment } from "react";
import { Box, styled } from "@mui/material";
import moment from "moment";
import { get, isPlainObject } from "lodash";

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
      font-size: 16px;
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

const CandidateEmploymentHistoryAccordion = ({
  title,
  empHistory,
  empGaps,
  titleIcon,
  headersEmpHistory = [],
  headersEmpGap = [],
  itemHeader,
  to,
  ...props
}) => {
  const getValue = (item, header) => {
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

  const todisplayHeaders = (item, header) => {
    if (!item.wasBonusReceived) {
      if (header.value === "bonus") return false;
    }

    if (!item.wasOnPayrollOfAgency) {
      if (
        header.value === "agencyApartmentUnitHouseNumber" ||
        header.value === "agencyBuildingName" ||
        header.value === "agencyStreetAddressLine1" ||
        header.value === "agencyStreetAddressLine2" ||
        header.value === "agencyCityTownDistrict" ||
        header.value === "agencyStateProvince" ||
        header.value === "agencyZipPostalAreaCode" ||
        header.value === "agencyCountryName" ||
        header.value === "agencyPhoneCountryCode" ||
        header.value === "agencyPhoneNumber" ||
        header.value === "agencyName"
      )
        return false;
    }

    if (header.text.includes("State/Province")) {
      if (item.countryId === 101 || item.countryId === 132) {
        header.text = "State/Province";
      } else {
        header.text = "State/Province*";
      }
    }

    if (item.reasonForLeaving === 5) {
      if (!item.wasResignationRequested) {
        if (header.value === "reasonOfResignationRequested") return false;
      }
      if (header.value === "otherReasonForLeaving") return false;
    } else if (item.reasonForLeaving === 8) {
      if (header.value === "wasResignationRequested") return false;
      if (header.value === "reasonOfResignationRequested") return false;
    } else {
      if (header.value === "otherReasonForLeaving") return false;
      if (header.value === "wasResignationRequested") return false;
      if (header.value === "reasonOfResignationRequested") return false;
    }

    if (item.bonusTypeId !== 3) {
      if (header.value === "otherBonusTypeName") return false;
    }

    if (item.salaryFrequencyId !== 6) {
      if (header.value === "otherSalaryFrequency") return false;
    }

    if (item.canContactEmployer) {
      if (
        header.value === "cessationDate" ||
        header.value === "reasonOfChoosingLateCessationDate"
      ) {
        return false;
      }
    }

    if (item.reasonOfChoosingLateCessationDate === "") {
      if (header.value === "reasonOfChoosingLateCessationDate") {
        return false;
      }
    }

    return true;
  };

  return (
    <Box p={2} sx={{ maxHeight: "80vh", minHeight: "100%", overflow: "auto" }}>
      <StyledTable>
        <tbody>
          {Array.isArray(empHistory) && empHistory?.length
            ? empHistory.map((item, index) => (
                <Fragment key={index}>
                  <tr>
                    <th>
                      <strong>
                        {itemHeader ? itemHeader(item, index) : `Item ${index}`}
                      </strong>
                    </th>
                  </tr>

                  {headersEmpHistory.map((header) => (
                    <>
                      {todisplayHeaders(item, header) && (
                        <>
                          {header.headerArray ? (
                            <>
                              {get(item, header.value)?.map(
                                (displayValue, displayIndex) =>
                                  header.headerValues.map(
                                    (headerValue, headerIndex) =>
                                      todisplayHeaders(
                                        displayValue,
                                        headerValue
                                      ) && (
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
                                ) : (
                                  header.text
                                )}
                              </th>
                              <>
                                {!header.heading && (
                                  <td>{getValue(item, header)}</td>
                                )}
                              </>
                            </tr>
                          )}
                        </>
                      )}
                    </>
                  ))}
                </Fragment>
              ))
            : null}
          {isPlainObject(empHistory) &&
            headersEmpHistory.map((header) => (
              <tr key={header.value}>
                <th>{header.text}</th>
                <td>{getValue(empHistory, header)}</td>
              </tr>
            ))}
          {Array.isArray(empGaps) && empGaps?.length
            ? empGaps.map((item, index) => (
                <Fragment key={index}>
                  <tr>
                    <th>
                      <strong>{`Employment Career Gap - ${index + 1}`}</strong>
                    </th>
                  </tr>

                  {headersEmpGap.map((header) => (
                    <>
                      {todisplayHeaders(item, header) && (
                        <tr key={header.value}>
                          <th
                            colSpan={header.heading ? 2 : 1}
                            style={
                              header.heading ? { borderRight: "none" } : {}
                            }
                          >
                            {header.heading ? (
                              <strong>
                                {header.text.replace("{{index}}", index + 1)}
                              </strong>
                            ) : (
                              header.text
                            )}
                          </th>
                          <>
                            {!header.heading && (
                              <td>{getValue(item, header)}</td>
                            )}
                          </>
                        </tr>
                      )}
                    </>
                  ))}
                </Fragment>
              ))
            : null}
        </tbody>
      </StyledTable>
    </Box>
  );
};

export default CandidateEmploymentHistoryAccordion;
