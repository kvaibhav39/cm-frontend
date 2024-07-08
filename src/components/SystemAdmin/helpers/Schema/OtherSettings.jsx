import * as Yup from "yup";
import { getOrgMsgMethodById } from "../../utils/getMsgMethodById";

export const otherSettingsSchema = (orgMsgMethodStatus) => {
  let Email = getOrgMsgMethodById(orgMsgMethodStatus, 1)?.methodName;
  let WhatsApp = getOrgMsgMethodById(orgMsgMethodStatus, 2)?.methodName;
  let SMS = getOrgMsgMethodById(orgMsgMethodStatus, 3)?.methodName;
  
  return Yup.object().shape({
    [Email]: Yup.boolean(),
    [WhatsApp]: Yup.boolean(),
    [SMS]: Yup.boolean(),
    allow2fAuthentication: Yup.boolean().when(
      [`${Email}`, `${WhatsApp}`, `${SMS}`],
      (Email, WhatsApp, SMS, schema) => {
        return schema.test({
          name: "allow2fAuthentication",
          test: (allow2fAuthentication) => {
            if (allow2fAuthentication && !Email && !WhatsApp && !SMS) {
              return false;
            }
            return true;
          },
          message:
            "Please select at least 1 method via which OTP would be sent",
          exclusive: true,
        });
      }
    ),
  });
};
