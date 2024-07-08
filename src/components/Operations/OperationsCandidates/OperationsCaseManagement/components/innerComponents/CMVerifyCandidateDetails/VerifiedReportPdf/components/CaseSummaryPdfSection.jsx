import { Text, View, Link } from "@react-pdf/renderer";
import useCommonStyles from "../utils/useCommonStyles";
import PdfContentLayout from "../layout/PdfContentLayout";
import { riskLevelColorsAndIcons } from "../assets/riskLevelColorsAndIcons";
import RiskLevelIcon from "../assets/RiskLevelIcon";
import HeadingPdfSection from "./HeadingPdfSection";

const CaseSummaryPdfSection = ({
  OpsBasicCandidateInfo,
  identityChecks,
  integrityChecks,
  reputationChecks,
  verificationChecks,
}) => {
  const commonStyles = useCommonStyles();

  const caseSummaryDetails = [
    {
      heading: "IDENTITY",
      icon: <RiskLevelIcon path={riskLevelColorsAndIcons("Low").icon} />,
      values: identityChecks,
    },
    {
      heading: "INTEGRITY",
      icon: <RiskLevelIcon path={riskLevelColorsAndIcons("Moderate").icon} />,
      values: integrityChecks,
    },
    {
      heading: "REPUTATION",
      icon: <RiskLevelIcon path={riskLevelColorsAndIcons("Low").icon} />,
      values: reputationChecks,
    },
    {
      heading: "VERIFICATION",
      icon: <RiskLevelIcon path={riskLevelColorsAndIcons("Low").icon} />,
      values: verificationChecks,
    },
  ];

  let finalCaseSummaryDetails = () => {
    let temp = [];

    caseSummaryDetails?.forEach((curr) => {
      if (curr?.values?.length) {
        temp.push(curr);
      }
    });

    return temp;
  };

  return (
    <PdfContentLayout OpsBasicCandidateInfo={OpsBasicCandidateInfo}>
      <View>
        <HeadingPdfSection heading="Case Summary" />

        {finalCaseSummaryDetails()?.map((curr, index) => (
          <View
            key={index}
            style={[commonStyles.width100, commonStyles.marginBottom15]}
          >
            <View
              style={[
                commonStyles.borderBottomBlue,
                commonStyles.paddingBottom2,
                commonStyles.displayFlexRow,
                commonStyles.justifyContentSpaceBetween,
                commonStyles.alignItemsCenter,
              ]}
            >
              <Text
                style={[
                  commonStyles.fontSize10,
                  commonStyles.fontWeight550,
                  { padding: "0 6px" },
                ]}
              >
                {curr.heading}
              </Text>
              <View>{curr.icon}</View>
            </View>
            {curr.values?.map((value, ind) => (
              <View
                key={ind}
                style={[
                  commonStyles.fontSize8,
                  commonStyles.displayFlexRow,
                  commonStyles.alignItems,
                  commonStyles.width100,
                ]}
              >
                <View
                  style={[
                    { width: "50%" },
                    commonStyles.padding6,
                    ind % 2 ? null : commonStyles.backgroundColorLightGrey,
                    commonStyles.borderRightDarkGrey,
                  ]}
                >
                  <Link
                    src={`#${value?.hyperLinkId}`}
                    style={commonStyles.link}
                  >
                    <Text>
                      {value?.update ? (
                        <Text
                          style={{
                            color: riskLevelColorsAndIcons("High").color,
                          }}
                        >
                          [Update]&nbsp;
                        </Text>
                      ) : null}
                      {value?.subCheckDisplayName}
                    </Text>
                  </Link>
                </View>
                <View
                  style={[
                    { width: "50%" },
                    commonStyles.padding6,
                    ind % 2 ? null : commonStyles.backgroundColorLightGrey,
                  ]}
                >
                  {value?.comment ? (
                    <Text style={commonStyles.paddingBottom4}>
                      {value.comment}
                    </Text>
                  ) : null}
                  <View
                    style={[
                      commonStyles.displayFlexRow,
                      commonStyles.alignItems,
                    ]}
                  >
                    <View style={{ margin: "0 4x 0 2px" }}>{value?.icon}</View>
                    <Text>{value?.value}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </PdfContentLayout>
  );
};

export default CaseSummaryPdfSection;
