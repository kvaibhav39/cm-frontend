import { Image, Text } from "@react-pdf/renderer";

const RiskLevelIcon = ({ path }) => (
  <Image style={{ width: 10, height: 10, marginRight: "5px" }} src={path} />
);

export default RiskLevelIcon;
