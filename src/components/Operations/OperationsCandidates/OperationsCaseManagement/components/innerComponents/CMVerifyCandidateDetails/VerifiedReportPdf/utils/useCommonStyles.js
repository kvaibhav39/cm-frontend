import { useTheme } from "@mui/material";
import { StyleSheet } from "@react-pdf/renderer";

const useCommonStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    fontFamily: {
      fontFamily: "Montserrat",
    },

    //content padding

    contentPaddingVertical: {
      paddingTop: "15px",
      paddingBottom: "60px",
    },
    contentPaddingHorizontal: {
      paddingLeft: "45px",
      paddingRight: "45px",
    },

    //font size

    fontSize32: {
      fontSize: 32,
    },
    fontSize20: {
      fontSize: 20,
    },
    fontSize14: {
      fontSize: 14,
    },
    fontSize12: {
      fontSize: 12,
    },
    fontSize10: {
      fontSize: 10,
    },
    fontSize8: {
      fontSize: 8,
    },
    fontWeight500: {
      fontWeight: 500,
    },
    fontWeight550: {
      fontWeight: 550,
    },
    fontWeight700: {
      fontWeight: 700,
    },
    fontColorWhite: {
      color: "#fff",
    },
    fontColorBlue: {
      color: theme.palette.primary.main,
    },

    //border

    borderBottomDarkGrey: {
      borderBottom: `1px solid ${theme.palette.grey[400]}`,
    },
    borderBottomGrey: {
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
    },
    borderBottomGreyThick: {
      borderBottom: `2px solid ${theme.palette.grey[200]}`,
    },
    borderBottomBlue: {
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
    borderBlue: {
      border: `1px solid ${theme.palette.primary.main}`,
    },
    borderRightDarkGrey: {
      borderRight: `1px solid ${theme.palette.grey[400]}`,
    },

    //padding
    padding4: {
      padding: 4,
    },
    padding6: {
      padding: 6,
    },

    padding8: {
      padding: 8,
    },

    paddingTop2: {
      paddingTop: 2,
    },

    paddingBottom2: {
      paddingBottom: 2,
    },

    paddingTop4: {
      paddingTop: 4,
    },

    paddingBottom4: {
      paddingBottom: 4,
    },

    paddingTop6: {
      paddingTop: 6,
    },

    paddingBottom6: {
      paddingBottom: 6,
    },

    paddingBottom8: {
      paddingBottom: 8,
    },

    //margin
    marginTop10: {
      marginTop: 10,
    },

    marginTop15: {
      marginTop: 15,
    },
    marginBottom15: {
      marginBottom: 15,
    },

    marginTop20: {
      marginTop: 20,
    },
    marginBottom20: {
      marginBottom: 20,
    },

    //display flex
    displayFlexRow: {
      display: "flex",
      flexDirection: "row",
    },

    displayFlexColumn: {
      display: "flex",
      flexDirection: "column",
    },

    justifyContentCenter: {
      justifyContent: "center",
    },

    justifyContentSpaceBetween: {
      justifyContent: "space-between",
    },

    alignItemsCenter: {
      alignItems: "center",
    },

    //width
    width100: { width: "100%" },

    //background
    backgroundColorLightGrey: {
      backgroundColor: "rgba(0,0,0,0.05)",
    },
    backgroundColorLightBlue: {
      backgroundColor: "rgba(82, 122, 251,0.2)",
    },

    //link
    link: {
      textDecoration: "none",
      cursor: "pointer",
    },
  });
};

export default useCommonStyles;
