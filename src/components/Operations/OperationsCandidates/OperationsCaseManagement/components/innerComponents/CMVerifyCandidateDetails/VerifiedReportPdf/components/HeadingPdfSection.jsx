import { Text, View } from "@react-pdf/renderer";
import React from "react";
import useCommonStyles from "../utils/useCommonStyles";

const HeadingPdfSection = ({ heading }) => {
  const commonStyles = useCommonStyles();

  const contentHeadingStyles = [
    commonStyles.fontSize14,
    commonStyles.fontWeight550,
    commonStyles.fontColorBlue,
    commonStyles.borderBottomGreyThick,
    commonStyles.paddingBottom2,
  ];
  return (
    <View>
      <Text style={[commonStyles.marginBottom15, ...contentHeadingStyles]}>
        {heading}
      </Text>
    </View>
  );
};

export default HeadingPdfSection;
