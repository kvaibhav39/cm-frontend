import PdfContentLayout from "../layout/PdfContentLayout";
import HeadingPdfSection from "./HeadingPdfSection";

const AppendixPdfSection = ({ OpsBasicCandidateInfo }) => {
  return (
    <PdfContentLayout OpsBasicCandidateInfo={OpsBasicCandidateInfo}>
      <HeadingPdfSection heading="Appendix" />
    </PdfContentLayout>
  );
};

export default AppendixPdfSection;
