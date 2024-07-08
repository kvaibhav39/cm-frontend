import ErrorPageTemplate from "./ErrorPageTemplate";
import no_internet from "../assets/images/no_internet.svg";

const PageNetworkError = () => (
  <ErrorPageTemplate
    firstText="It seems you are offline! Click"
    secondText="to retry again"
    navigateUrl="/"
    errorImage={no_internet}
  />
);

export default PageNetworkError;
