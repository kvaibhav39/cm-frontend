import { Box, Grid, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { clearToastNotificationStore } from "../store/actions/toastNotificationActions";

const ErrorPageTemplate = ({
  firstText = "Oops, Something went wrong! Click",
  secondText = "to navigate back",
  navigateUrl = "/",
  errorImage,
}) => {
  const dispatch = useDispatch();

  const handleClickHere = () => {
    dispatch(clearToastNotificationStore());
  };

  return (
    <Box
      height="100vh"
      sx={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1097%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='%230e2a47'%3e%3c/rect%3e%3cpath d='M720 1126.44C940.71 1133.65 1141.96 1014.23 1298.06 858.06 1454.16 701.89 1573.37 500.64 1566.02 280 1558.88 64.96 1405.51-101.57 1260.96-260.96 1105.49-432.46 951.42-648.76 720-653.1 486.76-657.44 311.41-457.73 158.53-281.47 19.23-120.82-93.12 67.41-89.2 280-85.35 489.3 34.07 670.04 178.69 821.31 327.51 976.92 504.82 1119.37 720 1126.44' fill='rgba(0%2c 14%2c 167%2c 1)'%3e%3c/path%3e%3cpath d='M720 981.34C902.87 987.31 1069.62 888.36 1198.96 758.96 1328.3 629.57 1427.08 462.82 1420.99 280 1415.07 101.82 1287.99-36.16 1168.22-168.22 1039.41-310.32 911.75-489.54 720-493.14 526.74-496.74 381.45-331.26 254.78-185.22 139.36-52.11 46.27 103.85 49.52 280 52.71 453.42 151.66 603.18 271.49 728.51 394.79 857.45 541.71 975.48 720 981.34' fill='rgba(4%2c 25%2c 252%2c 1)'%3e%3c/path%3e%3cpath d='M720 836.23C865.04 840.97 997.29 762.49 1099.87 659.87 1202.45 557.24 1280.79 424.99 1275.96 280 1271.26 138.69 1170.48 29.25 1075.49-75.49 973.32-188.19 872.08-330.33 720-333.18 566.73-336.03 451.5-204.79 351.03-88.97 259.49 16.6 185.66 140.3 188.24 280 190.77 417.54 269.25 536.31 364.28 635.72 462.08 737.98 578.6 831.59 720 836.23' fill='rgba(0%2c 65%2c 255%2c 1)'%3e%3c/path%3e%3cpath d='M720 691.13C827.2 694.63 924.95 636.63 1000.77 560.77 1076.59 484.92 1134.49 387.17 1130.92 280 1127.46 175.55 1052.96 94.67 982.75 17.25 907.24-66.05 832.4-171.11 720-173.22 606.71-175.33 521.54-78.33 447.29 7.29 379.63 85.32 325.06 176.74 326.96 280 328.83 381.66 386.83 469.45 457.08 542.92 529.36 618.5 615.48 687.69 720 691.13' fill='rgba(68%2c 96%2c 236%2c 1)'%3e%3c/path%3e%3cpath d='M720 546.02C789.37 548.29 852.62 510.76 901.68 461.68 950.74 412.59 988.2 349.34 985.89 280 983.65 212.42 935.45 160.08 890.02 109.98 841.15 56.08 792.73-11.9 720-13.26 646.7-14.62 591.59 48.14 543.54 103.54 499.76 154.03 464.45 213.19 465.68 280 466.89 345.78 504.42 402.58 549.87 450.13 596.65 499.03 652.37 543.8 720 546.02' fill='rgba(37%2c 71%2c 253%2c 1)'%3e%3c/path%3e%3cpath d='M720 400.92C751.53 401.95 780.28 384.89 802.58 362.58 824.88 340.27 841.91 311.52 840.86 280 839.84 249.28 817.93 225.49 797.28 202.72 775.07 178.22 753.06 147.32 720 146.7 686.68 146.08 661.63 174.61 639.79 199.79 619.89 222.74 603.84 249.63 604.4 280 604.95 309.9 622.01 335.72 642.67 357.33 663.93 379.56 689.26 399.91 720 400.92' fill='rgba(0%2c 12%2c 255%2c 1)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1097'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      pt={6}
    >
      <Typography
        fontWeight={600}
        fontSize={24}
        textAlign="center"
        color="#fff"
      >
        {firstText}{" "}
        <Box
          component="a"
          onClick={handleClickHere}
          color="#c4c4c4"
          sx={{ textDecoration: "underline", cursor: "pointer" }}
          href={navigateUrl}
        >
          here
        </Box>{" "}
        {secondText}
      </Typography>

      <img
        src={errorImage}
        alt="page-not-found"
        loading="lazy"
        width="40%"
        style={{ aspectRatio: "5/4" }}
      />
    </Box>
  );
};

export default ErrorPageTemplate;
