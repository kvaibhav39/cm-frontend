import { useTheme } from "@mui/material";
import { Page, Text, Image, View, StyleSheet } from "@react-pdf/renderer";
import useCommonStyles from "../utils/useCommonStyles";
import moment from "moment";

const PdfContentLayout = (props) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();

  const contentLayoutStyles = StyleSheet.create({
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 6,
    },
    headerImage: {
      width: 80,
    },
    footer: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      position: "absolute",
      bottom: -25,
    },
    footerColorStrip: {
      width: "100%",
      height: 20,
      position: "absolute",
      bottom: 0,
      backgroundColor: theme.palette.primary.main,
    },
  });

  return (
    <Page
      style={[commonStyles.contentPaddingVertical, commonStyles.fontFamily]}
    >
      <View
        style={[
          commonStyles.contentPaddingHorizontal,
          commonStyles.marginBottom15,
        ]}
        fixed
      >
        <View
          style={[contentLayoutStyles.header, commonStyles.borderBottomGrey]}
        >
          <Text style={[commonStyles.fontSize10, commonStyles.fontWeight500]}>
            CONFIDENTIAL
          </Text>
          <Image
            style={contentLayoutStyles.headerImage}
            src="https://s3.ap-southeast-1.amazonaws.com/cdn.accelscreening.online/CheckMinistry/PublicImages/check-mininstry-logo.png"
          />
        </View>
      </View>
      <View style={[commonStyles.contentPaddingHorizontal]}>
        {props.children}
      </View>
      <View
        style={[
          commonStyles.contentPaddingVertical,
          commonStyles.contentPaddingHorizontal,
          contentLayoutStyles.footer,
          commonStyles.fontSize8,
        ]}
        fixed
      >
        <Text>
          <Text style={commonStyles.fontWeight700}>
            {props?.OpsBasicCandidateInfo?.candidateName}
          </Text>
          &nbsp;|&nbsp;
          {moment().format("DD/MM/YYYY")}
        </Text>
        <Text
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
      <View style={contentLayoutStyles.footerColorStrip} fixed></View>
    </Page>
  );
};

export default PdfContentLayout;
