import NotFoundImage from "../assets/images/page-not-found.png";
import ErrorPageTemplate from "./ErrorPageTemplate";

const PageNotFound = () => (
  <ErrorPageTemplate
    firstText="The requested page was not found! Click"
    secondText="to navigate back"
    navigateUrl="/"
    errorImage={NotFoundImage}
  />
);

export default PageNotFound;
