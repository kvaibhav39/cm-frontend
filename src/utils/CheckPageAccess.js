const checkSecondLoginPresentAndFirstLoginOps = () => {
  const isSecondLoginProfilePresent = localStorage.getItem("second_login");

  //extracting first login details
  const switchAccountDetails =
    localStorage.getItem(`first_login`) &&
    JSON.parse(localStorage.getItem(`first_login`));

  const switchAccountLoggedInDetails =
    switchAccountDetails && JSON.parse(switchAccountDetails?.CheckMinistryUser);

  //if first login is Ops or vendor user & second login is present (candidate or hr org)
  //then no action permission should be applied
  if (
    isSecondLoginProfilePresent &&
    (switchAccountLoggedInDetails?.roleId === 4 ||
      switchAccountLoggedInDetails?.roleId === 2)
  ) {
    return true;
  }

  return false;
};

function validateString(validatorString, string) {
  const regex = createRegex(validatorString);
  return regex.test(string);
}

function createRegex(string) {
  const escapedString = string
    .split("")
    .map((char) => {
      if (char === "") return "[\\w\\d]";
      else return char;
    })
    .join("");
  return new RegExp(escapedString);
}

// export const checkPagePermission = (pathUrl, permissions) => {
//   let isUserAuthorised = false;

//   if (checkSecondLoginPresentAndFirstLoginOps()) {
//     return true;
//   }

//   if (permissions && permissions.pagesPermissions.length > 0) {
//     isUserAuthorised = permissions.pagesPermissions.find((page) => {
//       if (page.isAllowed) {
//         return validateString(page.pageUrl, pathUrl);
//       } else {
//         return false;
//       }
//     });
//   }
//   return !!isUserAuthorised;
// };

//to apply below check page permissions we need to check each and every route

export function checkPagePermission(pathUrl, permissions) {
  let isUserAuthorised = false;

  if (checkSecondLoginPresentAndFirstLoginOps()) {
    return true;
  }

  if (permissions && permissions.pagesPermissions.length > 0) {
    isUserAuthorised = permissions.pagesPermissions.find((page) => {
      if (page.pageUrl === pathUrl && page.isAllowed) {
        return true;
      }
      if (
        page.pageUrl.endsWith("*") &&
        pathUrl.startsWith(page.pageUrl.slice(0, -1))
      ) {
        return page.isAllowed;
      }
      return false;
    });
  }
  return isUserAuthorised ? isUserAuthorised : false;
}

export const checkModulePermission = (moduleName, permissions) => {
  let isUserAuthorised = false;
  if (permissions && permissions.modulesPermissions.length > 0) {
    isUserAuthorised = permissions.modulesPermissions.find(
      (module) => module.moduleName === moduleName && module.isAllowed
    );
  }

  return !!isUserAuthorised;
};

export const checkActionPermission = (actionName, permissions) => {
  let isUserAuthorised = false;

  if (checkSecondLoginPresentAndFirstLoginOps()) {
    return true;
  }

  if (permissions && permissions.actionsPermissions.length > 0) {
    isUserAuthorised = permissions.actionsPermissions.find(
      (action) => action.actionName === actionName && action.isAllowed
    );
  }

  return !!isUserAuthorised;
};
