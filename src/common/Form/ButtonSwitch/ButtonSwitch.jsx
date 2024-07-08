import { Grid, Button } from "@mui/material";

const BUTTON_TYPES = [
  "Text Answer",
  "Single Select Answer",
  "Multi Select Answer",
  "Rating Scale",
  "Yes/No with Justification",
];

export const ButtonSwitch = ({ form, field, ...props }) => {
  const { name, value = "" } = field;
  const { handleChange, setFieldValue, values } = form;

  const handleId = (path, id) => {
    // Basic data covers everything in id == 1
    let data = {
      questionTypeId: id,
      questionName:
        values[`questions`][parseInt(name.split("[")[1][0])]?.questionName,
      questionDescription: "",
      questionOrder: parseInt(name.split("[")[1][0]) + 1,
      isMandatory: false,
    };
    // any change that follows will update it
    if (id == 2) {
      data = {
        ...data,
        isMandatory: false,
        answerChoice: { answerChoice: ["", ""] },
      };
    }
    if (id == 3) {
      data = {
        ...data,
        isMandatory: false,
        answerChoice: {
          answerChoice: ["", ""],
          noOfAnswersRequired: 2,
        },
      };
    }
    if (id == 4) {
      data = {
        ...data,
        isMandatory: false,
        answerChoice: {
          minScale: 1,
          maxScale: 5,
          ratingCriteriaText: [""],
          scales: [{ scaleNumber: 1, scaleText: "" }],
        },
      };
    }
    if (id == 5) {
      data = {
        ...data,
        isMandatory: false,
        answerChoice: { answerChoice: ["Yes", "No"] },
      };
    }

    setFieldValue(`${path}`, data);
  };

  const handleButtonClick = (data, id) => {
    handleChange(data);
    let path = name.split(".")[0];
    handleId(path, id);
  };

  // WARNING: THE INDEX HERE STARTS AT 0, SO WE ARE ADDING 1 TO IT FOR CONSISTENCY
  return (
    <Grid container item spacing={3}>
      {BUTTON_TYPES.map((type, index) => (
        <Grid
          key={index}
          item
          sx={{
            textAlign: "center",
          }}
        >
          <Button
            variant={value == index + 1 ? "contained" : "outlined"}
            onClick={(data) => {
              // console.log(data);
              handleButtonClick(data, index + 1);
            }}
            id={name}
            name={name}
            value={index + 1 || ""}
          >
            {type}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};
