import NotFoundImage from "../assets/images/something-wrong.png";
import ErrorPageTemplate from "./ErrorPageTemplate";

const ErrorFallback = () => <ErrorPageTemplate errorImage={NotFoundImage} />;

export default ErrorFallback;
