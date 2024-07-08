import { useMemo } from "react";
import { Box, styled, Button } from "@mui/material";
import { Form, Formik } from "formik";
import { removeTimeFromDate } from "../../../../../../../Candidate/utils/removeTimeFromDate";
import OpsHelperOtherSections from "./../helpers/OpsHelperOtherSections";
import { pick } from "lodash";

const StyledTable = styled("table")`
  width: 100%;
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
      word-break: break-word;
    }
    th {
      width: 200px;
      color: #565261;
      font-weight: 400;
    }
    td {
      width: 250px;
      color: #56535b;
      font-weight: 500;
    }
  }
  tr:not(:last-child) {
    border-bottom: 1px solid #d9d9d9;
  }
  th {
    border-right: 1px solid #d9d9d9;
  }
`;

const OpsCandidateSectionDetail = ({
  title,
  items,
  sectionHeaders = [],
  itemHeader,
  numOfReferences,
  noOfProfessionalReference,
  sectionDetailsIdName,
  payloadFieldName,
  updateActionHandler,
  ...props
}) => {
  const initialValues = useMemo(() => {
    let temp = items;

    if (title?.includes("Employment")) {
      temp = props.empHistory;
    }

    return temp;
  }, [items, props]);

  const handleSubmit = (values, form) => {
    let finalPayload = [];

    if (title?.includes("Employment")) {
      values?.forEach((curr) => {
        let temp = {};
        props.headersEmpHistory?.forEach((header) => {
          if (header?.verifiedFieldName) {
            let finalValue = header?.toRemoveTimeFromDate
              ? removeTimeFromDate(curr[header?.verifiedFieldName]) || null
              : curr[header?.verifiedFieldName] || null;

            if (header?.verifiedFieldName === "bonusData") {
              finalValue = curr[header?.value]?.map((val) =>
                pick(val, [
                  "verifiedBonusCurrencyId",
                  "verifiedBonusAmount",
                  "bonusId",
                ])
              );
            }

            temp = {
              ...temp,
              [header?.verifiedFieldName]: finalValue || null,
            };
            // if (
            //   header?.verifiedFieldName === "reasonForNoRehire" &&
            //   curr?.eligibleForRehire !== "No"
            // ) {
            //   delete temp?.reasonForNoRehire;
            // }
          }
        });
        temp[sectionDetailsIdName] = curr[sectionDetailsIdName] || null;
        finalPayload.push(temp);
      });
    } else {
      values?.forEach((curr) => {
        let temp = {};
        sectionHeaders?.forEach((header) => {
          if (header?.verifiedFieldName) {
            temp = {
              ...temp,
              [header?.verifiedFieldName]: header?.toRemoveTimeFromDate
                ? removeTimeFromDate(curr[header?.verifiedFieldName]) || null
                : curr[header?.verifiedFieldName] || null,
            };
          }
        });
        temp[sectionDetailsIdName] = curr[sectionDetailsIdName] || null;
        finalPayload.push(temp);
      });
    }

    updateActionHandler({ [payloadFieldName]: finalPayload });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {(form) => (
        <Form>
          <Box
            p={2}
            sx={{ maxHeight: "75vh", overflow: "auto" }}
            id="ops-candidate-details-scroll"
          >
            <StyledTable>
              <tbody>
                {title?.includes("Employment") ? (
                  <OpsHelperOtherSections
                    title={title}
                    itemHeader={itemHeader}
                    headersEmpHistory={props.headersEmpHistory}
                    headersEmpGap={props.headersEmpGap}
                    empHistory={props.empHistory}
                    empGaps={props.empGaps}
                    values={form.values}
                    setFieldValue={form.setFieldValue}
                  />
                ) : (
                  <OpsHelperOtherSections
                    title={title}
                    itemHeader={itemHeader}
                    sectionHeaders={sectionHeaders}
                    items={items}
                    numOfReferences={numOfReferences}
                    noOfProfessionalReference={noOfProfessionalReference}
                    values={form.values}
                    setFieldValue={form.setFieldValue}
                  />
                )}
              </tbody>
            </StyledTable>
          </Box>
          <Box p={2} pt={1} display="flex" justifyContent="flex-end">
            <Button variant="contained" type="submit" color="primary">
              Update
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default OpsCandidateSectionDetail;
