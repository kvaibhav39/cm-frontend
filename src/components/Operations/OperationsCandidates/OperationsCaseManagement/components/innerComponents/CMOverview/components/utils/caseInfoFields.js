import { Box } from "@mui/material";

export const caseInfoFields = (OpsBasicCandidateInfo,allCountries ) => {
  return  [
    {
      id: 1,
      fieldName: "Organization Name",
      fieldValue: () => OpsBasicCandidateInfo?.hrOrganizationName,
    },
    {
      id: 2,
      fieldName: "Team",
      fieldValue: () => OpsBasicCandidateInfo?.hrTeamName || "-",
    },
   
    {
      id: 4,
      fieldName: "Package",
      fieldValue: () => OpsBasicCandidateInfo?.packageName || "-",
    },
    {
      id: 5,
      fieldName: "Hiring Country",
      fieldValue: () => OpsBasicCandidateInfo?.hiringCountryName || "-",
    },
    {
      id: 6,
      fieldName: "Research Country",
      fieldValue: () => {
        let researchCountry =
          OpsBasicCandidateInfo?.candidateCheckMappingCases[0]?.checkScope
            ?.jurisdictionId;
        return (
          <Box>
            <Box>{researchCountry?.length || "No Results Yet"}</Box>
            <Box>
              {researchCountry?.length
                ? researchCountry?.map((curr) => (
                    <Box>
                      &bull;&nbsp;
                      {
                        allCountries?.find((c) => c?.countryMasterId === +curr)
                          ?.name
                      }
                    </Box>
                  ))
                : null}
            </Box>
          </Box>
        );
      },
    },
  ];
};
