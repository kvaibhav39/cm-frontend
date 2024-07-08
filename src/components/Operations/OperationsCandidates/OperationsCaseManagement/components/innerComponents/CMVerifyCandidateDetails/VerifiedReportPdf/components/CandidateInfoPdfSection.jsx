import { Text, View } from "@react-pdf/renderer";
import useCommonStyles from "../utils/useCommonStyles";
import PdfContentLayout from "../layout/PdfContentLayout";
import { riskLevelColorsAndIcons } from "../assets/riskLevelColorsAndIcons";
import RiskLevelIcon from "../assets/RiskLevelIcon";
import HeadingPdfSection from "./HeadingPdfSection";
import moment from "moment";
import { useMemo } from "react";

const CandidateInfoPdfSection = ({
  candidateDetailsById,
  OpsBasicCandidateInfo,
  allSubChecksLists,
}) => {
  const commonStyles = useCommonStyles();

  let {
    candidateCasePersonalData,
    lastUpdatedDateOfCandidateCase,
    verificationResultStatusName,
    internalStatus,
    registrationDate,
  } = OpsBasicCandidateInfo;

  const candidateInfoDetails = [
    {
      field: "Candidate Name",
      value:
        candidateCasePersonalData?.firstName ||
        candidateCasePersonalData?.middleName ||
        candidateCasePersonalData?.lastName
          ? `${candidateCasePersonalData?.firstName || ""} ${
              candidateCasePersonalData?.middleName || ""
            } ${candidateCasePersonalData?.lastName || ""}`
          : "-",
    },
    {
      field: "Name in Local Language",
      value: candidateCasePersonalData?.otherNameExists
        ? candidateCasePersonalData?.otherNames
            ?.map((curr) => `${curr.otherName} : ${curr.otherNameLanguageName}`)
            ?.join(", ")
        : "-",
    },
    {
      field: "Alias/Nickname/Former Name",
      value: candidateCasePersonalData?.formerNameExists
        ? candidateCasePersonalData?.formerNames
            ?.map(
              (curr) =>
                `${curr.formerName} : ${moment(
                  curr.formerNameDateChange
                ).format("DD/MM/YYYY")}`
            )
            ?.join(", ")
        : "-",
    },
    {
      field: "Date of Birth",
      value: moment(candidateCasePersonalData?.dateOfBirth)
        .format("DD MMM YYYY")
        .replace(/\d{4}$/, "****"),
    },
    {
      field: "Identification Number",
      value:
        candidateDetailsById?.IDENTITY_DETAILS?.identityDocumentType &&
        candidateDetailsById?.IDENTITY_DETAILS?.identityDocumentNumber
          ? `${
              candidateDetailsById?.IDENTITY_DETAILS?.identityDocumentType
            } : ${
              candidateDetailsById?.IDENTITY_DETAILS?.identityDocumentNumber?.slice(
                0,
                -5
              ) + "*****"
            } `
          : "-",
    },
    {
      field: "Date of Request",
      value: moment(registrationDate).format("DD/MM/YYYY"),
    },
    {
      field: "Report Date",
      value: moment().format("DD/MM/YYYY"),
    },
  ];

  const { highRiskChecks, moderateRiskChecks, unableToVerifyRiskChecks } =
    useMemo(() => {
      let highRiskChecks = [];
      let moderateRiskChecks = [];
      let unableToVerifyRiskChecks = [];

      allSubChecksLists?.forEach((curr) => {
        if (curr?.subCheckVerificationResultStatusId === 3) {
          highRiskChecks.push(curr);
        }
        if (curr?.subCheckVerificationResultStatusId === 2) {
          moderateRiskChecks.push(curr);
        }
        if (curr?.subCheckVerificationResultStatusId === 4) {
          unableToVerifyRiskChecks.push(curr);
        }
      });
      return { highRiskChecks, moderateRiskChecks, unableToVerifyRiskChecks };
    }, [allSubChecksLists]);

  const caseOverviewDetails = [
    {
      color: riskLevelColorsAndIcons("High").color,
      checksCount: highRiskChecks?.length,
      text: "check(s) in High Risk",
      values: highRiskChecks?.map((curr) => curr?.subCheckDisplayName),
    },
    {
      color: riskLevelColorsAndIcons("Moderate").color,
      checksCount: moderateRiskChecks?.length,
      text: "check(s) in Moderate Risk",
      values: moderateRiskChecks?.map((curr) => curr?.subCheckDisplayName),
    },
    {
      color: riskLevelColorsAndIcons().color,
      checksCount: unableToVerifyRiskChecks?.length,
      text: "check(s) as Unable to Verify",
      values: unableToVerifyRiskChecks?.map(
        (curr) => curr?.subCheckDisplayName
      ),
    },
  ];

  const riskLevelDefinitions = [
    {
      icon: <RiskLevelIcon path={riskLevelColorsAndIcons("High").icon} />,
      name: "High",
      riskName: "High Risk",
      desc: "Information verified with material inconsistencies and/or major derogatory information found",
    },
    {
      icon: <RiskLevelIcon path={riskLevelColorsAndIcons("Moderate").icon} />,
      name: "Moderate",
      riskName: "Moderate Risk",
      desc: "Information verified with slight inconsistencies and/or minor derogatory information found",
    },
    {
      icon: <RiskLevelIcon path={riskLevelColorsAndIcons("Low").icon} />,
      name: "Low",
      riskName: "Low Risk",
      desc: "Information verified with no inconsistencies and/or no derogatory information found",
    },
    {
      icon: (
        <RiskLevelIcon
          path={riskLevelColorsAndIcons("Unable to verify").icon}
        />
      ),
      name: "Unable to verify",
      riskName: "Unable to Verify",
      desc: "Information cannot be verified due to certain reason(s)",
    },
    {
      icon: <RiskLevelIcon path={riskLevelColorsAndIcons("Pending").icon} />,
      name: "Pending",
      riskName: "Pending",
      desc: "Check on hold due to pending for additional information to proceed further",
    },
    {
      icon: (
        <RiskLevelIcon path={riskLevelColorsAndIcons("In progress").icon} />
      ),
      name: "In progress",
      riskName: "In progress",
      desc: "Check has been initiated and awaiting result",
    },
  ];

  let { displayIcon, tooltipTitle } = useMemo(() => {
    let displayIcon, tooltipTitle;

    let ifPresent = riskLevelDefinitions?.find(
      (curr) => curr?.riskName === verificationResultStatusName
    );

    displayIcon = ifPresent
      ? ifPresent.icon
      : riskLevelColorsAndIcons("High").icon;

    tooltipTitle = ifPresent ? ifPresent.desc : "";

    return { displayIcon, tooltipTitle };
  }, [verificationResultStatusName]);

  return (
    <PdfContentLayout OpsBasicCandidateInfo={OpsBasicCandidateInfo}>
      <View>
        <HeadingPdfSection heading="Candidate Information" />

        {/*candidate info */}
        <View style={commonStyles.marginBottom20}>
          {candidateInfoDetails?.map((curr, index) => (
            <View
              key={index}
              style={[
                commonStyles.paddingTop6,
                commonStyles.paddingBottom6,
                index !== candidateInfoDetails?.length - 1
                  ? commonStyles.borderBottomDarkGrey
                  : null,
                commonStyles.displayFlexRow,
                commonStyles.alignItemsCenter,
                commonStyles.fontSize8,
                commonStyles.width100,
              ]}
            >
              <Text style={{ width: "40%" }}>{curr.field}</Text>
              <Text style={[commonStyles.fontWeight550, { width: "60%" }]}>
                {curr.value}
              </Text>
            </View>
          ))}
        </View>

        {/*overrall risk level */}
        <View
          style={[
            commonStyles.borderBlue,
            commonStyles.fontSize10,
            commonStyles.fontWeight550,
            commonStyles.displayFlexRow,
            commonStyles.justifyContentSpaceBetween,
            commonStyles.padding4,
            commonStyles.marginBottom15,
          ]}
        >
          <Text>Overall Risk Level</Text>
          <View
            style={[commonStyles.displayFlexRow, commonStyles.alignItemsCenter]}
          >
            <RiskLevelIcon path={displayIcon} />
            <Text>{verificationResultStatusName || "NO RESULTS YET"}</Text>
          </View>
        </View>

        {/*case overview */}
        <View>
          <HeadingPdfSection heading="Case Overview" />
          {caseOverviewDetails?.map((curr, index) => (
            <View
              key={index}
              style={[
                { minHeight: 90 },
                commonStyles.width100,
                index && commonStyles.marginTop15,
                commonStyles.displayFlexRow,
              ]}
            >
              <View
                style={[
                  { width: "16%", height: "100%", backgroundColor: curr.color },
                  commonStyles.fontColorWhite,
                  commonStyles.displayFlexColumn,
                  commonStyles.justifyContentCenter,
                  commonStyles.alignItemsCenter,
                  commonStyles.padding8,
                ]}
              >
                <Text
                  style={[commonStyles.fontSize32, commonStyles.fontWeight550]}
                >
                  {curr.checksCount}
                </Text>
                <Text
                  style={[
                    commonStyles.fontSize8,
                    commonStyles.fontWeight550,
                    { textAlign: "center", lineHeight: "1.5px" },
                  ]}
                >
                  {curr.text}
                </Text>
              </View>
              <View
                style={[
                  {
                    width: "84%",
                    borderTop: `3px solid ${curr.color}`,
                    marginLeft: "-1px",
                  },
                  commonStyles.padding4,
                ]}
              >
                {curr.values?.map((value, ind) => (
                  <View
                    key={ind}
                    style={[
                      commonStyles.fontSize8,
                      commonStyles.displayFlexRow,
                      commonStyles.alignItemsCenter,
                    ]}
                  >
                    <Text
                      style={{
                        fontWeight: 900,
                        fontSize: "12px",
                        margin: "-0.5px 3px 0.8px",
                      }}
                    >
                      &bull;
                    </Text>
                    <Text>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/*risk lvl definitions*/}
        <View>
          <Text
            style={[
              commonStyles.marginTop15,
              commonStyles.paddingBottom2,
              commonStyles.borderBottomDarkGrey,
              commonStyles.fontSize8,
            ]}
          >
            Risk Level Definitions:
          </Text>
          {riskLevelDefinitions?.map((curr, index) => (
            <View
              key={index}
              style={[
                commonStyles.displayFlexRow,
                commonStyles.alignItemsCenter,
                commonStyles.paddingTop4,
                commonStyles.fontSize8,
                commonStyles.width100,
                { paddingLeft: 10 },
              ]}
            >
              <Text style={{ width: "3%" }}>{curr.icon}</Text>
              <Text
                style={{ width: "97%" }}
              >{`${curr.name} - ${curr.desc}`}</Text>
            </View>
          ))}
        </View>
      </View>
    </PdfContentLayout>
  );
};

export default CandidateInfoPdfSection;
