import { useState } from "react";
import {
  Page,
  Text,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import Html from "react-pdf-html";

export const ConsentSubmittedContent = ({
  consentSign,
  consentText,
  candidateName,
  consentDate,
}) => {
  const [pageNumber, setPageNumber] = useState(1);

  const styles = StyleSheet.create({
    body: {
      paddingVertical: 35,
      paddingHorizontal: 35,
      position: "relative",
    },
    text: {
      margin: 12,
      fontSize: 10,
      textAlign: "justify",
      fontFamily: "Montserrat",
    },
    name: {
      margin: 6,
      fontSize: 10,
      textAlign: "justify",
      fontFamily: "Montserrat",
    },
    image: {
      marginHorizontal: 100,
      width: "40%",
      marginLeft: 0,
    },
    horizontailLine: {
      borderBottom: "1px solid black",
      marginVertical: 20,
    },
    sign: {
      width: "30%",
      height: 80,
    },
    footer_text: {
      paddingHorizontal: 35,
      fontFamily: "Montserrat",
      fontSize: 8,
      color: "#616161",
      fontStyle: "italic",
      position: "absolute",
      bottom: 30,
      left: 0,
      right: 0,
    },
    pageNumber: {
      position: "absolute",
      fontSize: 8,
      bottom: 10,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
  });

  Font.register({
    family: "Montserrat",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf",
        fontWeight: 400,
      },
      {
        src: "https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-Y3tcoqK5.ttf",
        fontWeight: 700,
      },
      {
        src: "https://fonts.gstatic.com/s/montserrat/v25/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9aX9-p7K5ILg.ttf",
        fontStyle: "italic",
      },
    ],
  });

  //added this so that words arent breaking with hyphen in them inside the consent pdf
  Font.registerHyphenationCallback((word) => [word]);

  const stylesheet = {
    h1: {
      fontSize: 12,
      fontFamily: "Montserrat",
      marginBottom: "-5px",
      marginTop: "-20px",
    },
    p: {
      fontSize: 10,
      fontFamily: "Montserrat",
    },
  };

  return (
    <Document>
      <Page style={styles.body} pageNumber={pageNumber}>
        {/* <Image style={styles.image} src="../../assets/images/logo.png" /> */}
        <Image
          style={styles.image}
          src="https://s3.ap-southeast-1.amazonaws.com/cdn.accelscreening.online/CheckMinistry/PublicImages/check-mininstry-logo.png"
        />
        <Text style={styles.horizontailLine}></Text>
        <Html stylesheet={stylesheet}>{consentText}</Html>
        <Text style={styles.name}>Your Full Legal Name: {candidateName}</Text>
        <Text style={styles.name}>Date of Consent: {consentDate}</Text>
        <Text style={styles.name}>Signature</Text>
        <Image style={styles.sign} src={consentSign} />
        <Text style={styles.footer_text}>
          By signing and clicking "Submit Consent" you are providing your
          consent to CheckMinistry to use your personal information that you
          will be submitting for conducting checks for your employment
          verification purpose. Your digital signature will be electronically
          recorded.
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};
