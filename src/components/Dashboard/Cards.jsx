import { Card, CardContent, Grid, Box, Typography } from "@mui/material";
import Chart from "react-apexcharts";
import TotalIcon from "../../assets/images/icons/total-icon.svg";
import CompletedIcon from "../../assets/images/icons/completed-icon.svg";
import WaitingIcon from "../../assets/images/icons/waiting-icon.svg";
import InprogressIcon from "../../assets/images/icons/inprogress-icon.svg";
import TerminatedIcon from "../../assets/images/icons/terminated.svg";
import NotActivatedIcon from "../../assets/images/icons/not-activated.svg";
import NotSubmittedIcon from "../../assets/images/icons/not-submitted.svg";
import NoDiscrepancyIcon from "../../assets/images/icons/no-discrepancy-icon.svg";
import MinorDiscrepancyIcon from "../../assets/images/icons/minor-discrepancy-icon.svg";
import MajorDiscrepancyIcon from "../../assets/images/icons/major-discrepancy-icon.svg";
import UnableToVerifyIcon from "../../assets/images/icons/unable-to-verify-icon.svg";
import { useSelector } from "react-redux";
import CircularLoader from "./../../common/CircularLoader";

const Cards = () => {
  let { hrDashboardStatistics: statistics } = useSelector(
    (state) => state.organizations
  );

  const getResultStatusIcon = (id) => {
    switch (id) {
      case 1:
        return (
          <img
            src={NoDiscrepancyIcon}
            alt="total"
            style={{ display: "block", margin: "auto", width: "50%" }}
          />
        );
        break;
      case 2:
        return (
          <img
            src={MinorDiscrepancyIcon}
            alt="total"
            style={{ display: "block", margin: "auto", width: "50%" }}
          />
        );
        break;
      case 3:
        return (
          <img
            src={MajorDiscrepancyIcon}
            alt="total"
            style={{ display: "block", margin: "auto", width: "50%" }}
          />
        );
        break;
      case 4:
        return (
          <img
            src={UnableToVerifyIcon}
            alt="total"
            style={{ display: "block", margin: "auto", width: "50%" }}
          />
        );
        break;
      default:
        return (
          <img
            src={CompletedIcon}
            alt="total"
            style={{ display: "block", margin: "auto", width: "50%" }}
          />
        );
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 8:
        return (
          <div
            style={{
              backgroundColor: "rgba(194, 192, 199,0.5)",
              width: "60%",
              maxHeight: "44px",
              height: "50%",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={TerminatedIcon}
              alt="total"
              style={{ display: "block", transform: "scale(0.4)" }}
            />
          </div>
        );
        break;
      case 5:
      case 6:
      case 7:
        return (
          <div
            style={{
              backgroundColor: "rgba(40, 199, 111, 0.12)",
              width: "60%",
              maxHeight: "44px",
              height: "50%",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={CompletedIcon}
              alt="total"
              style={{ display: "block", margin: "auto" }}
            />
          </div>
        );
        break;
      case 4:
        return (
          <div
            style={{
              backgroundColor: "rgba(255, 159, 67, 0.12)",
              width: "60%",
              maxHeight: "44px",
              height: "50%",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={WaitingIcon}
              alt="total"
              style={{ display: "block", margin: "auto" }}
            />
          </div>
        );
        break;
      case 3:
        return (
          <div
            style={{
              backgroundColor: "rgba(223, 231, 248, 1)",
              width: "60%",
              maxHeight: "44px",
              height: "50%",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={InprogressIcon}
              alt="total"
              style={{ display: "block", margin: "auto" }}
            />
          </div>
        );
        break;
      case 2:
        return (
          <div
            style={{
              backgroundColor: "rgba(255, 159, 67, 0.12)",
              width: "60%",
              maxHeight: "44px",
              height: "50%",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={NotSubmittedIcon}
              alt="total"
              style={{
                display: "block",
                margin: "auto",
                transform: "scale(0.6)",
              }}
            />
          </div>
        );
        break;
      case 1:
        return (
          <div
            style={{
              backgroundColor: "rgba(255, 159, 67, 0.12)",
              width: "60%",
              maxHeight: "44px",
              height: "50%",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={NotActivatedIcon}
              alt="total"
              style={{
                display: "block",
                margin: "auto",
                transform: "scale(0.6)",
              }}
            />
          </div>
        );
        break;
      default:
        return (
          <div
            style={{
              backgroundColor: "rgba(118, 148, 255, 0.12)",
              width: "60%",
              maxHeight: "44px",
              height: "50%",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={TotalIcon}
              alt="total"
              style={{ display: "block", margin: "auto" }}
            />
          </div>
        );
    }
  };

  const getValues = () => {
    let options = [];
    statistics?.resultStatusStatisics?.map((data) => {
      options.push(data.count);
    });
    return options;
  };

  const isNull = () => {
    const result = getValues();
    if (result[0] == 0 && result[1] == 0 && result[2] == 0 && result[3] == 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4">Result Status</Typography>
      </Grid>
      {statistics ? (
        <Grid
          container
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <Grid
            item
            gap={3}
            xs={8}
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
          >
            {statistics?.resultStatusStatisics?.map((data) => {
              return (
                <Card
                  sx={{
                    minWidth: 300,
                    textAlign: "center",
                    backgroundColor: data.colorCode,
                    borderTopLeftRadius: "100px",
                    borderBottomLeftRadius: "100px",
                    borderTopRightRadius: "20px",
                    borderBottomRightRadius: "20px",
                  }}
                  key={data.resultStatusId}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={4}
                      sx={{
                        width: "100%",
                        maxWidth: "30.33% !important",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: data.colorCode,
                      }}
                    >
                      {getResultStatusIcon(data.resultStatusId)}
                    </Grid>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {data.resultStatusName}
                      </Typography>
                      <Typography variant="h4">{data.count}</Typography>
                    </CardContent>
                  </Grid>
                </Card>
              );
            })}
          </Grid>
          <Grid item sm={8} md={4}>
            {statistics?.processStatusSummary && (
              <Chart
                options={{
                  chart: { type: "donut" },
                  dataLabels: {
                    style: {
                      colors: ["ff0014"],
                    },
                  },
                  colors: !isNull()
                    ? ["#57E29566", "#F5900866", "#EA545566", "#55526233"]
                    : "#d5e0d8",
                  labels: !isNull()
                    ? [
                        "No Discrepancy",
                        "Minor Discrepancy",
                        "Major Discrepancy",
                        "Unable to Verify",
                      ]
                    : ["No Result Status Present   "],
                  responsive: [
                    {
                      breakpoint: 480,
                      options: {
                        chart: {
                          width: 300,
                        },
                        legend: {
                          position: "bottom",
                        },
                      },
                    },
                  ],
                  plotOptions: {
                    pie: {
                      donut: {
                        labels: {
                          show: true,
                          total: {
                            show: true,
                            label: "Total Cases",
                            formatter: () => {
                              let casesCount;

                              statistics?.processStatusSummary?.forEach(
                                (curr) => {
                                  if (
                                    curr.processStatusName === "Total Cases"
                                  ) {
                                    casesCount = curr.count;
                                  }
                                }
                              );

                              return casesCount;
                            },
                          },
                        },
                      },
                    },
                  },
                }}
                series={!isNull() ? getValues() : [1]}
                type="donut"
              />
            )}
          </Grid>
        </Grid>
      ) : (
        <CircularLoader height="10vh" size={40} />
      )}

      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={4}
        mb={8}
      >
        <Typography variant="h4">Process Status Summary</Typography>
      </Grid>
      {statistics ? (
        <Grid
          container
          item
          spacing={3}
          gap={3}
          px={{ xs: 0, md: 5 }}
          alignItems="center"
          justifyContent={{ xs: "center", md: "space-around" }}
        >
          {statistics?.processStatusSummary?.map((data) => {
            return (
              <Card
                sx={{
                  minWidth: 275,
                  textAlign: "center",
                  background: "#FFFFFF",
                  borderRadius: "6px",
                  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                }}
                key={data.processStatusId}
              >
                <Grid container>
                  <Grid item xs={8}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {data.processStatusName}
                      </Typography>
                      <Typography variant="h4">{data.count}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      width: "100%",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {getIcon(data?.processStatusId)}
                  </Grid>
                </Grid>
              </Card>
            );
          })}
        </Grid>
      ) : (
        <CircularLoader height="10vh" size={40} />
      )}
    </>
  );
};

export default Cards;
