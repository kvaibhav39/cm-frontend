import { omit } from "lodash";

export const getFilteredDataForCacheSubmit = (cacheValues) => {
    let tempArr = [];
    
    cacheValues?.forEach((curr) => {
      let tempAttach = [];
      curr.attachments?.forEach((attach) => {
        if (attach.status === "existing" || attach.status === "uploaded") {
          tempAttach.push(omit(attach, "icon"));
        }
      });
      tempArr.push({
        ...curr,
        attachments: tempAttach,
      });
    });
    return tempArr
  };