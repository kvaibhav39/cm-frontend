import { Text, View } from "@react-pdf/renderer";
import useCommonStyles from "../utils/useCommonStyles";
import { riskLevelColorsAndIcons } from "../assets/riskLevelColorsAndIcons";
import RiskLevelIcon from "../assets/RiskLevelIcon";

const IndividualCheckDetails = ({ curr, index }) => {
  const commonStyles = useCommonStyles();

  return (
    <View
      break={index > 0}
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
          break={ind > 0 && value?.startFromNewPage}
          key={ind}
          style={[
            commonStyles.fontSize10,
            commonStyles.width100,
            ind > 0 ? null : commonStyles.marginTop15,
            commonStyles.padding6,
          ]}
        >
          {/*heading*/}
          <Text
            id={value?.hyperLinkId}
            style={[commonStyles.fontColorBlue, commonStyles.paddingBottom6]}
          >
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

          {/*heading field value i.e check summary*/}
          {value?.fieldValue?.map((fValue, fIndex) => (
            <View
              key={fIndex}
              style={[
                commonStyles.fontSize8,
                commonStyles.displayFlexRow,
                commonStyles.alignItems,
                commonStyles.width100,
              ]}
            >
              <View
                style={[
                  {
                    width: value?.subCheckDisplayName?.includes(
                      "Professional Reference"
                    )
                      ? "40%"
                      : "30%",
                    color: "grey",
                    marginLeft: 6,
                  },
                  commonStyles.paddingTop4,
                  commonStyles.paddingBottom8,
                  commonStyles.borderRightDarkGrey,
                ]}
              >
                <Text>{fValue.param}</Text>
              </View>
              <View
                style={[
                  {
                    width: value?.subCheckDisplayName?.includes(
                      "Professional Reference"
                    )
                      ? "60%"
                      : "70%",
                    marginLeft: 6,
                  },
                  commonStyles.paddingTop4,
                  commonStyles.paddingBottom6,
                ]}
              >
                <View
                  style={[commonStyles.displayFlexRow, commonStyles.alignItems]}
                >
                  {fValue?.paramIcon ? (
                    <View style={{ margin: "0 4x 0 2px" }}>
                      {fValue?.paramIcon}
                    </View>
                  ) : null}
                  <Text>{fValue.paramValue}</Text>
                </View>
              </View>
            </View>
          ))}

          {/*verification details*/}
          {value?.verificationDetails ? (
            <View style={{ marginTop: 6 }}>
              {value?.verificationDetails?.map(
                (verificationValue, verificationIndex) => (
                  <View
                    key={verificationIndex}
                    style={[
                      commonStyles.fontSize8,
                      commonStyles.displayFlexRow,
                      commonStyles.alignItems,
                      commonStyles.width100,
                      verificationIndex % 2
                        ? commonStyles.backgroundColorLightGrey
                        : null,
                    ]}
                  >
                    <View
                      style={[
                        {
                          width: value?.subCheckDisplayName?.includes(
                            "Professional Reference"
                          )
                            ? "40%"
                            : "30%",
                          color: "grey",
                          marginLeft: 6,
                        },
                        commonStyles.paddingTop4,
                        commonStyles.paddingBottom8,
                        commonStyles.borderRightDarkGrey,
                      ]}
                    >
                      <Text>{verificationValue.param}</Text>
                    </View>
                    <View
                      style={[
                        {
                          width: value?.subCheckDisplayName?.includes(
                            "Professional Reference"
                          )
                            ? "60%"
                            : "70%",
                          marginLeft: 6,
                        },
                        commonStyles.paddingTop4,
                        commonStyles.paddingBottom6,
                      ]}
                    >
                      {verificationValue?.renderParamValue ? (
                        verificationValue.renderParamValue
                      ) : (
                        <View
                          style={[
                            commonStyles.displayFlexRow,
                            commonStyles.alignItems,
                          ]}
                        >
                          <Text
                            style={{
                              width: value?.candidateInputPresent
                                ? "47%"
                                : "0%",
                              textAlign:
                                verificationValue?.param ===
                                "Verification Details"
                                  ? "center"
                                  : "none",
                            }}
                          >
                            {verificationValue.paramCandidateValue}
                          </Text>
                          <Text
                            style={{
                              width: value?.candidateInputPresent
                                ? value?.verifierInputPresent
                                  ? "3%"
                                  : "0%"
                                : "0%",
                            }}
                          ></Text>
                          <Text
                            style={{
                              width: value?.candidateInputPresent
                                ? value?.verifierInputPresent
                                  ? "50%"
                                  : "0%"
                                : "100%",
                              textAlign:
                                verificationValue?.param ===
                                "Verification Details"
                                  ? "center"
                                  : "none",
                            }}
                          >
                            {verificationValue.paramVerifierValue}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )
              )}
            </View>
          ) : null}

          {/*rating candidate*/}
          {value?.candidateRating?.length ? (
            <>
              {value?.candidateRating?.map(
                (candidateRatingDetails, candidateRatingIndex) => (
                  <View key={candidateRatingIndex} style={[{ marginTop: 6 }]}>
                    <Text
                      style={[
                        commonStyles.fontSize8,
                        commonStyles.fontWeight550,
                        { textAlign: "center", marginBottom: 6 },
                      ]}
                    >
                      {candidateRatingDetails?.heading}
                    </Text>
                    {candidateRatingDetails?.ratingValues?.map(
                      (ratingValue, ratingIndex) => (
                        <View
                          key={ratingIndex}
                          style={[
                            commonStyles.fontSize8,
                            commonStyles.displayFlexRow,
                            commonStyles.alignItems,
                            commonStyles.width100,
                            ratingIndex % 2
                              ? null
                              : commonStyles.backgroundColorLightGrey,
                          ]}
                        >
                          <View
                            style={[
                              {
                                width: "30%",
                                color: "grey",
                                marginLeft: 6,
                              },
                              commonStyles.paddingTop4,
                              commonStyles.paddingBottom8,
                              commonStyles.borderRightDarkGrey,
                              ,
                            ]}
                          >
                            <Text>{ratingValue.param}</Text>
                          </View>
                          <View
                            style={[
                              { width: "65%", marginLeft: 6 },
                              commonStyles.paddingTop4,
                              commonStyles.paddingBottom6,
                              commonStyles.displayFlexRow,
                              commonStyles.alignItems,
                              commonStyles.justifyContentSpaceBetween,
                            ]}
                          >
                            {candidateRatingDetails?.ratingScales?.map(
                              (scaleName, scaleIndex) => (
                                <View
                                  key={scaleIndex}
                                  style={[
                                    commonStyles.displayFlexRow,
                                    commonStyles.alignItemsCenter,
                                  ]}
                                >
                                  <RiskLevelIcon
                                    path={
                                      ratingValue?.paramSelectedValue ===
                                      scaleName
                                        ? riskLevelColorsAndIcons(
                                            "Reference_check_select"
                                          ).icon
                                        : riskLevelColorsAndIcons(
                                            "Reference_check_deselect"
                                          ).icon
                                    }
                                  />
                                  <Text
                                    style={{
                                      color:
                                        ratingValue?.paramSelectedValue ===
                                        scaleName
                                          ? riskLevelColorsAndIcons(
                                              "Reference_check_select"
                                            ).color
                                          : riskLevelColorsAndIcons(
                                              "Reference_check_deselect"
                                            ).color,
                                    }}
                                  >
                                    {scaleName}
                                  </Text>
                                </View>
                              )
                            )}
                          </View>
                        </View>
                      )
                    )}
                  </View>
                )
              )}
            </>
          ) : null}

          {/*verifier details*/}
          {value?.verifierDetails ? (
            <View
              style={[
                { marginTop: 10 },
                commonStyles.padding6,
                commonStyles.backgroundColorLightBlue,
              ]}
            >
              <Text
                style={[commonStyles.fontSize8, commonStyles.fontColorBlue]}
              >
                {value?.verifierDetails?.heading}
              </Text>
              {value?.verifierDetails?.values?.map(
                (verifierValue, verifierIndex) => (
                  <View
                    key={verifierIndex}
                    style={[
                      commonStyles.fontSize8,
                      commonStyles.displayFlexRow,
                      commonStyles.alignItems,
                      commonStyles.width100,
                    ]}
                  >
                    <View
                      style={[
                        {
                          width: "30%",
                          color: "grey",
                        },
                        commonStyles.paddingTop6,
                        commonStyles.paddingBottom4,
                      ]}
                    >
                      <Text>{verifierValue.param}</Text>
                    </View>
                    <View
                      style={[
                        { width: "70%" },
                        commonStyles.paddingTop6,
                        commonStyles.paddingBottom4,
                      ]}
                    >
                      <View
                        style={[
                          commonStyles.displayFlexRow,
                          commonStyles.alignItems,
                        ]}
                      >
                        {Array.isArray(verifierValue.paramValue) ? (
                          verifierValue.paramValue?.map((curr, i) => (
                            <Text key={i}>
                              {curr}
                              {i < verifierValue.paramValue.length - 1
                                ? ", "
                                : null}
                            </Text>
                          ))
                        ) : (
                          <Text>{verifierValue.paramValue}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                )
              )}
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
};

export default IndividualCheckDetails;


