import {Divider, Grid, Stack, Typography} from "@mui/material";
import {Field} from "formik";
import {CounterField} from "../../../../common/Form/CounterField/CounterField";
import {useState} from "react";

const EducationCheck = ({checkOrderId}) => {
    const [rolesValue, setRolesValue] = useState();
    return (
        <Grid item xs={12}>
            <Stack
                spacing={2}
                divider={<Divider orientation="horizontal" flexItem />}
            >
                <Grid container className={"flex-container"} columns={16}>
                    <Grid item xs={8} className={"min-width-100"}>
                        <Typography variant="h5" gutterBottom>
                            Please select number of educations to be verified.
                        </Typography>
                        <Typography variant="subtitle2">
                            * Highest {rolesValue} Education qualification(s) of candidate will be verified.
                        </Typography>
                    </Grid>
                    <Grid item xs={4} className={"min-width-100 text-center"}>
                        <Field
                            name={`checks[${checkOrderId}].checkScope.noOfHighestEducation`}
                            setRolesValue={(val) => setRolesValue(val)}
                            component={CounterField}
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Grid>
    );
}

export default EducationCheck;
