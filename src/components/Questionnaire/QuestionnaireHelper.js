export const getQuestionnaireId = (params) => {
  const prefix = params.row.questionnaireType === "SYSTEM" ? "DQ" : "CQ";
  return `${prefix}${params.row.questionnairesId || ""}`;
};

export const getCreatedByInitials = (params) => {
  const questionnaireType = params.row.questionnaireType;
  return questionnaireType === "SYSTEM"
    ? "System"
    : params.row.createdByUser?.userName;
};

export const getUpdatedByInitials = (params) => {
  const questionnaireType = params.row.questionnaireType;
  return questionnaireType === "SYSTEM"
    ? "System"
    : params.row.updatedByUser.userName;
};
