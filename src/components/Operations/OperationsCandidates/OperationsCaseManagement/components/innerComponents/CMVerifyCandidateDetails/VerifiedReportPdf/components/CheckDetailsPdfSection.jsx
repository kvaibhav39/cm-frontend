import { View } from "@react-pdf/renderer";
import PdfContentLayout from "../layout/PdfContentLayout";
import HeadingPdfSection from "./HeadingPdfSection";

import IndividualCheckDetails from "./IndividualCheckDetails";

const CheckDetailsPdfSection = ({ OpsBasicCandidateInfo, checkDetails }) => {
  return (
    <PdfContentLayout OpsBasicCandidateInfo={OpsBasicCandidateInfo}>
      <View>
        <HeadingPdfSection heading="Check Details" />

        {checkDetails?.map((curr, index) => (
          <IndividualCheckDetails key={index} curr={curr} index={index} />
        ))}
      </View>
    </PdfContentLayout>
  );
};

export default CheckDetailsPdfSection;
