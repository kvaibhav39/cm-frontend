import { useTheme } from "@mui/material";
import { Page, Text, Image, View, StyleSheet } from "@react-pdf/renderer";
import useCommonStyles from "../utils/useCommonStyles";
import moment from "moment";

const CoverPagePdfSection = ({ OpsBasicCandidateInfo }) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();

  const coverPageStyles = StyleSheet.create({
    coverPage: {
      backgroundColor: theme.palette.primary.main,
      padding: "30px 100px 30px 45px",
      height: "100vh",
    },
    image: {
      width: "40%",
    },
    horizontailLine: {
      borderBottom: "3px solid #fff",
      marginVertical: 20,
      width: "60%",
      marginLeft: "-50px",
    },
    coverPageContent: {
      marginTop: "50%",
    },
    coverPageTextH1: {
      marginBottom: "5%",
    },
    coverPageTextH2: {
      marginBottom: "2%",
    },
    coverPageTextH3: {
      marginTop: "2%",
      width: "85%",
    },
    bgImage: {
      position: "absolute",
      bottom: -170,
      left: "50%",
      width: "150%",
    },
  });

  const Br = () => "\n";

  return (
    <Page
      style={[
        coverPageStyles.coverPage,
        commonStyles.fontColorWhite,
        commonStyles.fontFamily,
      ]}
    >
      <Image
        style={coverPageStyles.image}
        src="https://s3.ap-southeast-1.amazonaws.com/cdn.accelscreening.online/CheckMinistry/PublicImages/check-mininstry-logo.png"
      />
      <Text style={coverPageStyles.horizontailLine}></Text>
      <Text style={commonStyles.fontSize32}>Background Screening Report</Text>

      <View style={coverPageStyles.coverPageContent}>
        <Text
          style={[
            coverPageStyles.coverPageTextH1,
            commonStyles.fontSize32,
            commonStyles.fontWeight550,           
          ]}
        >
          {OpsBasicCandidateInfo?.candidateName}
        </Text>
        <Text
          style={[
            coverPageStyles.coverPageTextH2,
            commonStyles.fontSize20,
            commonStyles.fontWeight550,
          ]}
        >
          Case Number: {OpsBasicCandidateInfo?.caseNumber}
        </Text>
        <Text
          style={[
            coverPageStyles.coverPageTextH2,
            commonStyles.fontSize20,
            commonStyles.fontWeight550,
          ]}
        >
          Report Date: {moment().format("DD/MM/YYYY")}
        </Text>
        <Text style={[coverPageStyles.coverPageTextH3, commonStyles.fontSize8]}>
          Disclaimer: <Br />
          <Br /> The information contained in this report has been gathered by
          CheckMinistry from various data sources and third parties. While
          CheckMinistry has used best efforts to ensure that the data retrieved
          meets the highest standards available in each jurisdiction, and is
          collected and handled with expert care, CheckMinistry cannot guarantee
          the completeness or accuracy of the data as CheckMinistry is neither
          the data owner nor originating source.
          <Br />
          <Br /> By taking possession of this report, the client specifically
          acknowledges the possible inaccuracies in the information provided or
          that there is a chance of it being incomplete or outdated. The client
          specifically acknowledges and agrees that the client shall not have
          any claims against CheckMinistry for any action or decision that has
          been made in relation to the information contained in this report.
          <Br />
          <Br /> The client also specifically confirms that any consent which
          was provided by the subject of this report was provided legally and
          not withdrawn, and that the subject understands the reason for which
          the consent was provided.
          <Br />
          <Br /> In some jurisdictions, the law may require release of the
          report to the subject, which CheckMinistry will provide upon request.
        </Text>
      </View>
      <View fixed>
        <Image
          style={coverPageStyles.bgImage}
          src="../../../../../../../../../assets/images/android-chrome-512x512.png"
        />
      </View>
    </Page>
  );
};

export default CoverPagePdfSection;
