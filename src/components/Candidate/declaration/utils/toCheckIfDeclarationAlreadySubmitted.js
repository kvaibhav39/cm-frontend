export const toCheckIfDeclarationAlreadySubmitted = (declarations,allowAllFields=false) => {
  let isDeclarationSubmitted = true;

  declarations?.forEach((declaration) => {
    return declaration?.questionnaireQuestions?.forEach((ques) => {
      if ((allowAllFields || ques?.isMandatory) && !ques?.answer) {
        return (isDeclarationSubmitted = false);
      }
    });
  });

  return isDeclarationSubmitted;
};
