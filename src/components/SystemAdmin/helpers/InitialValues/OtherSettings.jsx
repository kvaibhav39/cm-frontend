import { getOrgMsgMethodById } from "../../utils/getMsgMethodById";

export const otherSettingsInitialValues = (orgMsgMethodStatus) => {
  const helperForMsgMethod = (id) =>
    getOrgMsgMethodById(orgMsgMethodStatus, id);

  let Email = helperForMsgMethod(1)?.methodName;
  let WhatsApp = helperForMsgMethod(2)?.methodName;
  let SMS = helperForMsgMethod(3)?.methodName;

  return {
    allow2fAuthentication: orgMsgMethodStatus?.allow2fAuthentication || false,
    doNotDisplayClientName: orgMsgMethodStatus?.doNotDisplayClientName || false,
    eligibleAddressDurationInMonth:
      orgMsgMethodStatus?.eligibleAddressDurationInMonth || null,
    [Email]: helperForMsgMethod(1)?.isActive || false,
    [`${Email}_Id`]: helperForMsgMethod(1)?.messageMethodId || 1,
    [WhatsApp]: helperForMsgMethod(2)?.isActive || false,
    [`${WhatsApp}_Id`]: helperForMsgMethod(2)?.messageMethodId || 2,
    [SMS]: helperForMsgMethod(3)?.isActive || false,
    [`${SMS}_Id`]: helperForMsgMethod(3)?.messageMethodId || 3,
  };
};
