import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import {
  Accordion,
  AccordionSummary,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import PanelCard from "../../common/cards/PanelCard";
import HrTabNav from "./HrTabNav";
import { useDispatch } from "react-redux";
import ScrollableGrid from "../../common/ScrollableGrid";
import {
  getAllNotications,
  getUpdateNotication,
} from "../../store/actions/hrActions";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const HrNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedTab, setSelectedTab] = useState(2);
  const dispatch = useDispatch();

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );
    dispatch(getAllNotications(setNotifications, logDetails));
  }, []);

  const SwitchField = ({ form, field, ...props }) => {
    const { name, value } = field;
    const { setFieldValue } = form;

    const handleNotificationSwitch = () => {
      setFieldValue(name, !value);
      let params = {
        notificationId: props.notificationId,
        isSubscribed: !value,
      };

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleNotificationSwitch"
      );

      dispatch(getUpdateNotication(params, logDetails));
    };

    return (
      <Switch
        name={name}
        label={name}
        onChange={(e) => handleNotificationSwitch()}
        size="small"
        onClick={(e) => e.stopPropagation()}
        checked={value}
      />
    );
  };

  return (
    <ScrollableGrid container spacing={2}>
      <Grid item md={2} xs={12}>
        <PanelCard>
          <HrTabNav value={selectedTab || ""} />
        </PanelCard>
      </Grid>
      <Grid item md={10} xs={12}>
        <PanelCard>
          <Grid
            container
            padding={3}
            spacing={3}
            sx={{
              borderRadius: "10px",
            }}
          >
            <Grid item xs={12} sm={11}>
              <Typography variant="h6" fontSize="16px" textAlign="left">
                You will be receiving all turned on notifications via Email,
                SMS, Application. You may turn ON/OFF per your preference.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={11}>
              <Formik
                enableReinitialize
                initialValues={{ notifications: notifications }}
              >
                <Form>
                  <Grid container spacing={2} xs={12} sm={10}>
                    {notifications?.map((notification, index) => (
                      <Grid
                        item
                        xs={12}
                        sm={11}
                        key={notification.notificationId}
                      >
                        <Accordion style={{ width: "100%" }} expanded={false}>
                          <AccordionSummary id={notification.notificationId}>
                            <Grid item xs={11}>
                              <Typography variant="h5">
                                {notification.notificationDescription}
                              </Typography>
                            </Grid>
                            <Grid
                              container
                              item
                              xs={1}
                              alignItems={"center"}
                              justifyContent={"center"}
                            >
                              <Field
                                name={`notifications[${index}].isSubscribed`}
                                notificationId={notification.notificationId}
                                component={SwitchField}
                              />
                            </Grid>
                          </AccordionSummary>
                        </Accordion>
                      </Grid>
                    ))}
                  </Grid>
                </Form>
              </Formik>
            </Grid>
          </Grid>
        </PanelCard>
      </Grid>
    </ScrollableGrid>
  );
};

export default HrNotification;
