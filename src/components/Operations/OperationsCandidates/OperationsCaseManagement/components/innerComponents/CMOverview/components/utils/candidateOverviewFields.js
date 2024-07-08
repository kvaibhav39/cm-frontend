import moment from "moment";
import CustomTooltip from "../../../../../../../../common/CustomTooltip";
import { Chip } from "@mui/material";
import CheckStatusPreview from "../../../../../../../../Candidates/CandidatesTable/Cells/CheckStatusPreview";
import { calculateM1DueDate } from "../../../../../../utils/calculateM1DueDate";

export const candidateOverviewFields = (OpsBasicCandidateInfo) => {

  let result = calculateM1DueDate(OpsBasicCandidateInfo?.submissionDate);
  let dueDate = result?.dueDate;
  let diffInDays = result?.differenceInDays;

  return [
    {
      id: 1,
      fieldName: "Registration Date",
      fieldValue: (value) =>
        moment(OpsBasicCandidateInfo?.registrationDate).format("DD/MM/YYYY"),
    },
    {
      id: 2,
      fieldName: "Submission Date",
      fieldValue: (value) =>
        OpsBasicCandidateInfo?.submissionDate
          ? moment(OpsBasicCandidateInfo?.submissionDate).format("DD/MM/YYYY")
          : "-",
    },
    {
      id: 3,
      fieldName: "M1 Due Date",
      fieldValue: (value) => (
        <>
          {OpsBasicCandidateInfo?.submissionDate ? dueDate : "-"}
          <CustomTooltip title="M1 Due Date">
            <Chip
              label={OpsBasicCandidateInfo?.submissionDate ? diffInDays : "-"}
              size="small"
              sx={{
                color: diffInDays >= 0 ? "#00C95C" : "#FF989A",
                backgroundColor: diffInDays >= 0 ? "#D9F9EB" : "#FBDDE2",
                fontSize: "10px",
                width: "25px",
                height: "16px",
                marginLeft: "5px",
                marginTop: "-2px",
                padding: "1px",
                borderRadius: "1px",
                "> span": {
                  padding: 0,
                },
              }}
            />
          </CustomTooltip>
        </>
      ),
    },    
    {
      id: 5,
      fieldName: "Last Update Date",
      fieldValue: (value) =>
        OpsBasicCandidateInfo?.lastUpdatedDateOfCandidateCase
          ? moment(
              OpsBasicCandidateInfo?.lastUpdatedDateOfCandidateCase
            ).format("DD/MM/YYYY")
          : "-",
    },
    {
      id: 7,
      fieldName: "Internal Check Status",
      fieldValue: () => (
        <CheckStatusPreview
          data={OpsBasicCandidateInfo?.internalStatus}
          selectedPackageName={OpsBasicCandidateInfo?.packageName}
          width="12px"
          height="12px"
          fontSize="8px"
        />
      ),
      renderComponent: true,
    },
  ];
};
