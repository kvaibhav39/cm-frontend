import { calculate_Back_Next_Urls } from "./CandidateModule_Back_Next_URLs";

//function to return back/next urls & to return section datas as per the sectionName prop
export const getSectionData = (sectionName, candidateProfileSections,allowProfileEdit) => {
  return {
    section: candidateProfileSections?.find((section) => {
      return section.candidateProfileSectionName === sectionName;
    }),
    urls: calculate_Back_Next_Urls(sectionName, candidateProfileSections,allowProfileEdit),
  };
};
