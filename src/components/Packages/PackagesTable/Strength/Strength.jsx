import { Grid } from "@mui/material";

const Strength = ({ strengthPercentage, colorCode }) => {
  const strength = () => {
    if (strengthPercentage > 80 && strengthPercentage <= 100) {
      return (
        <Grid
          container
          spacing={1}
          xs="12"
          style={{
            border: "1.6px solid #C1C1C1",
            borderRadius: "2px",
            marginTop: "0px",
          }}
        >
          {[1, 2, 3, 4, 5].map((key) => (
            <div
              style={{
                backgroundColor: colorCode,
                width: "15%",
                borderRadius: "1px",
                height: "15px",
                margin: "2px",
              }}
            ></div>
          ))}
        </Grid>
      );
    } else if (strengthPercentage > 60 && strengthPercentage <= 80) {
      return (
        <Grid
          container
          spacing={1}
          xs="12"
          style={{
            border: "1.6px solid #C1C1C1",
            borderRadius: "2px",
            marginTop: "0px",
          }}
        >
          {[0, 1, 2, 3].map((key) => (
            <div
              style={{
                backgroundColor: colorCode,
                width: "15%",
                borderRadius: "1px",
                height: "15px",
                margin: "2px",
              }}
            ></div>
          ))}
          {[0].map((key) => (
            <div
              style={{
                backgroundColor: "#fff",
                width: "15%",
                borderRadius: "1px",
                height: "15px",
                margin: "2px",
              }}
            ></div>
          ))}
        </Grid>
      );
    } else if (strengthPercentage > 40 && strengthPercentage <= 60) {
      return (
        <Grid
          container
          xs="12"
          spacing={1}
          style={{
            border: "1.6px solid #C1C1C1",
            borderRadius: "2px",
            marginTop: "0px",
          }}
        >
          {[0, 1, 2].map((key) => (
            <div
              style={{
                backgroundColor: colorCode,
                width: "15%",
                borderRadius: "1px",
                height: "15px",
                margin: "2px",
              }}
            ></div>
          ))}
          {[0, 1].map((key) => (
            <div
              style={{
                backgroundColor: "#fff",
                width: "15%",
                borderRadius: "1px",
                height: "15px",
                margin: "2px",
              }}
            ></div>
          ))}
        </Grid>
      );
    } else if (strengthPercentage > 20 && strengthPercentage <= 40) {
      return (
        <Grid
          container
          spacing={1}
          xs="12"
          style={{
            border: "1.6px solid #C1C1C1",
            borderRadius: "2px",
            marginTop: "0px",
          }}
        >
          {[0, 1].map((key) => (
            <div
              style={{
                backgroundColor: colorCode,
                width: "15%",
                borderRadius: "1px",
                height: "15px",
                margin: "2px",
              }}
            ></div>
          ))}
          {[0, 1, 2].map((key) => (
            <div
              style={{
                backgroundColor: "#fff",
                width: "15%",
                borderRadius: "1px",
                height: "15px",
                margin: "2px",
              }}
            ></div>
          ))}
        </Grid>
      );
    } else {
      return (
        <Grid
          container
          spacing={1}
          xs="12"
          style={{
            border: "1.6px solid #C1C1C1",
            borderRadius: "2px",
            marginTop: "0px",
          }}
        >
          {[0].map((key) => (
            <div
              style={{
                backgroundColor: colorCode,
                width: "15%",
                borderRadius: "1px",
                height: "15px",
                margin: "2px",
              }}
            ></div>
          ))}
          {[0, 1, 2, 4].map((key) => (
            <div
              style={{
                backgroundColor: "#fff",
                width: "15%",
                borderRadius: "1px",
                height: "15px",
                margin: "2px",
              }}
            ></div>
          ))}
        </Grid>
      );
    }
  };

  return (
    <Grid
      container
      direction="row"
      sx={{
        alignItems: "center",
      }}
    >
      <Grid
        item
        xs="3"
        sx={{ marginRight: "7px" }}
      >{`${strengthPercentage}% `}</Grid>
      <Grid xs="6">{strength()}</Grid>
    </Grid>
  );
};

export default Strength;
