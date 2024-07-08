import { Box } from "@mui/material";

export const candidateInfoFields = (OpsBasicCandidateInfo) => {
  return [
    {
      id: 1,
      fieldName: "First Name",
      fieldValue: () =>
        OpsBasicCandidateInfo?.candidateCasePersonalData?.firstName || "-",
    },
    {
      id: 2,
      fieldName: "Middle Name",
      fieldValue: () =>
        OpsBasicCandidateInfo?.candidateCasePersonalData?.middleName || "-",
    },
    {
      id: 3,
      fieldName: "Last Name",
      fieldValue: () =>
        OpsBasicCandidateInfo?.candidateCasePersonalData?.lastName || "-",
    },
    {
      id: 4,
      fieldName: "Name in Other Language",
      fieldValue: () => (
        <Box>
          {OpsBasicCandidateInfo?.candidateCasePersonalData?.otherNames?.length
            ? OpsBasicCandidateInfo?.candidateCasePersonalData?.otherNames?.map(
                (curr) => (
                  <Box>
                    &bull;&nbsp;
                    {curr.otherNameLanguageName}
                    &nbsp;:&nbsp;({curr.otherName})
                  </Box>
                )
              )
            : "-"}
        </Box>
      ),
    },
    {
      id: 5,
      fieldName: "Former Name",
      fieldValue: () => (
        <Box>
          {OpsBasicCandidateInfo?.candidateCasePersonalData?.formerNames?.length
            ? OpsBasicCandidateInfo?.candidateCasePersonalData?.formerNames?.map(
                (curr) => (
                  <Box>
                    &bull;&nbsp;
                    {curr.formerName}
                  </Box>
                )
              )
            : "-"}
        </Box>
      ),
    },

    {
      id: 6,
      fieldName: "Nationality",
      fieldValue: () =>
        OpsBasicCandidateInfo?.candidateCasePersonalData?.countryOfBirthName ||
        "-",
    },
    {
      id: 7,
      fieldName: "Date Of Birth",
      fieldValue: () =>
        OpsBasicCandidateInfo?.candidateCasePersonalData?.dateOfBirth || "-",
    },
    {
      id: 8,
      fieldName: "Current Address (Country)",
      fieldValue: () => "-",
    },
    {
      id: 9,
      fieldName: "Personal Email Address",
      fieldValue: () =>
        OpsBasicCandidateInfo?.candidateCasePersonalData?.personalEmail || "-",
    },
  ];
};
