import { store } from "../index";
import { deleteMethod, get, post, put } from "../../api/api";
import { errorUtils } from "../../utils/ErrorUtils";
import {
  getAddRemovalPermissionsDataUrl,
  getAdditionalCheckSettingsUrl,
  getAdditionalEmailDetailsUrl,
  getAllowedResearchCountriesSettingsUrl,
  getCheckCostsOfAllCountriesUrl,
  getConsentEmailsUrl,
  getCustomEmailCategoriesUrl,
  getCustomEmailsUrl,
  getCustomFieldCategoriesUrl,
  getCustomFieldTypesUrl,
  getDeleteAdditionalEmailDetailsUrl,
  getDeleteCustomFieldUrl,
  getDeleteEditConsentEmailUrl,
  getDeleteEditCustomEmailUrl,
  getDeleteRemovalPermissionsDataUrl,
  getEmailProviderSettingUrl,
  getInternalUsersUrl,
  getOrgOtherSettingsUrl,
  getOrganizationsUrl,
  getPermissionsPerPermissionTypeUrl,
  getPostAdditionalEmailDetailsUrl,
  getPutAdditionalEmailDetailsUrl,
  getRegisterCandidateFieldSettingsUrl,
  getRelationshipDetailsUrl,
  getRemovalPermissionsDataUrl,
  getRolesUrl,
  getSubmitCustomEmailUrl,
  getSubmitCustomFieldUrl,
  getSubmitInternalUsersUrl,
  getSubroles,
  getUpdateCheckCostsOfCountriesUrl,
  getUpdateEmailProviderSettingUrl,
  getUpdateRelationshipUrl,
  getUpdateResearchCountriesUrl,
  updateAdditionalCheckSettingsUrl,
  updateAllowedResearchCountriesSettingsUrl,
  updateRegisterCandidateFieldSettingsUrl,
} from "../../utils/UrlUtils";
import { ERROR, SUCCESS } from "../constant";
import {
  GET_ROLES,
  CLEAR_STORE,
  GET_ORGS,
  SELECTED_ORG,
  GET_INTERNAL_USERS,
  GET_CUSTOM_FIELD_CATEGORIES,
  GET_CUSTOM_FIELD_TYPES,
  GET_CUSTOM_EMAIL_CATEGORIES,
  GET_CUSTOM_EMAILS,
  GET_CONSENT_EMAILS,
  GET_ORG_MSG_METHOD_STATUS,
  GET_CHECK_COST_FOR_ALL_COUNTRIES,
  GET_ORG_RELATIONSHIP,
  GET_ADDITIONAL_EMAIL_SETTINGS_DATA,
  GET_EMAIL_PROVIDER_SETTING,
  LOADING,
  GET_ADDITIONAL_CHECKS_SETTING_DATA,
  GET_PERMISSIONS_DATA_AS_PER_PERMISSION_TYPE,
  PERMISSIONS_LIST_LOADING,
  GET_REMOVAL_PERMISSIONS_DATA,
  PERMISSION_TYPE_LOADING,
  GET_ALLOWED_RESEARCH_COUNTRIES_SETTING_DATA,
  GET_CANDIDATE_REGISTRATION_FIELD_SETTINGS,
  UPDATE_CHECK_PRICE_ACCORDION_LOADING,
} from "./actionTypes";
import { getAllCountries } from "./helperActions";
import { getCustomFieldByOrgId } from "./hrActions";
import { getOPSUserBySubRoleIds } from "./operationActions";
import { setToastNotification } from "./toastNotificationActions";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

export const clearOrgStore = () => {
  return {
    type: CLEAR_STORE,
  };
};

//get - roles in sysadmin
export const getRolesLists = (includeRoleIds, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getRolesUrl());

      let rolesList = [];

      response?.data?.data?.forEach((curr) => {
        if (includeRoleIds?.find((id) => id === curr?.userRolesId)) {
          rolesList.push(curr);
        }
      });

      dispatch({ type: GET_ROLES, payload: rolesList });
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

//get - orgs in sysadmin
export const getOrgsLists = (logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: LOADING,
        payload: true,
      });
      const response = await get(getOrganizationsUrl());
      dispatch({
        type: GET_ORGS,
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      dispatch({
        type: LOADING,
        payload: false,
      });
    }
  };
};

//simple action to set selected org from the dropdown
export const setSelectedOrg = (data) => {
  return {
    type: SELECTED_ORG,
    payload: data,
  };
};

///////////internal users//////////////

//get - internal users
export const getInternalUsersLists = (logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });
      const response = await get(getInternalUsersUrl());
      dispatch({ type: GET_INTERNAL_USERS, payload: response?.data?.data });
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      dispatch({ type: LOADING, payload: false });
    }
  };
};

//post - internal users
export const submitInternalUser = (
  logDetails,
  data,
  ops,
  modalClose,
  runCustom = () => {}
) => {
  return async (dispatch) => {
    try {
      const response = await post(getSubmitInternalUsersUrl(), data);
      dispatch(
        setToastNotification(SUCCESS, "User Created Successfully!", logDetails)
      );

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "submitInternalUser"
      );

      if (ops) {
        dispatch(
          getOPSUserBySubRoleIds(
            {
              // subRoleIds: "7,8,9,10",
              subRoleIds: "7,9",
            },
            innerLogDetails
          )
        );
      } else {
        dispatch(getInternalUsersLists(innerLogDetails));
      }
      modalClose();
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      runCustom();
    }
  };
};

///////////check prices//////////////
export const getCheckCostsOfAllCountries = (
  checksId,
  orgId = null,
  logDetails
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: UPDATE_CHECK_PRICE_ACCORDION_LOADING,
        payload: true,
      });

      let responseForAllOrg = await get(
        getCheckCostsOfAllCountriesUrl(checksId),
        {
          orgId: null,
        }
      );

      let responseForSelectedOrg;
      if (orgId) {
        responseForSelectedOrg = await get(
          getCheckCostsOfAllCountriesUrl(checksId),
          {
            orgId,
          }
        );
      }

      let tempAllOrgData = responseForAllOrg?.data?.data
        ? [...responseForAllOrg?.data?.data]
        : [];
      let tempSelectedOrgData = responseForSelectedOrg?.data?.data
        ? [...responseForSelectedOrg?.data?.data]
        : [];

      let tempFinalData = tempAllOrgData.map((allOrgData) => {
        if (tempSelectedOrgData.length > 0) {
          let tempSelectedOrg = tempSelectedOrgData.find(
            (selectedOrgData) =>
              selectedOrgData.countryId === allOrgData.countryId &&
              selectedOrgData.cost !== allOrgData.cost
          );

          if (tempSelectedOrg) {
            return { ...tempSelectedOrg, oldCost: allOrgData.cost || "0" };
          } else {
            return allOrgData;
          }
        } else {
          return allOrgData;
        }
      });

      dispatch({
        type: GET_CHECK_COST_FOR_ALL_COUNTRIES,
        payload: tempFinalData,
      });
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      dispatch({
        type: UPDATE_CHECK_PRICE_ACCORDION_LOADING,
        payload: false,
      });
    }
  };
};

export const updateCheckCostOfCountries = (
  checksId,
  data,
  orgId = null,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const res = await put(
        getUpdateCheckCostsOfCountriesUrl(),
        data,
        orgId
          ? {
              orgId,
            }
          : undefined
      );
      dispatch(
        setToastNotification(
          SUCCESS,
          "Check Cost Updated Successfully!",
          logDetails
        )
      );

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "updateCheckCostOfCountries"
      );

      dispatch(getCheckCostsOfAllCountries(checksId, orgId, innerLogDetails));
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

///////////custom fields//////////////

//get - custom fields categories
export const getCustomFieldCategoriesLists = (logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getCustomFieldCategoriesUrl());
      dispatch({
        type: GET_CUSTOM_FIELD_CATEGORIES,
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

//get - cutom fields types
export const getCustomFieldTypesLists = (logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getCustomFieldTypesUrl());
      dispatch({ type: GET_CUSTOM_FIELD_TYPES, payload: response?.data?.data });
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

//post - custom fields
export const submitCustomField = (data, orgId, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await post(getSubmitCustomFieldUrl(orgId), data);
      dispatch(
        setToastNotification(
          SUCCESS,
          "Custom Field Created Successfully!",
          logDetails
        )
      );

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "submitCustomField"
      );

      dispatch(
        getCustomFieldByOrgId(
          { fieldCategoryName: null },
          {
            orgId,
          },
          innerLogDetails
        )
      );
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

//delete - custom field
export const deleteCustomField = (orgId, customFieldId, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await deleteMethod(
        getDeleteCustomFieldUrl(orgId, customFieldId)
      );
      dispatch(
        setToastNotification(
          SUCCESS,
          "Custom Field Deleted Successfully!",
          logDetails
        )
      );

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "deleteCustomField"
      );

      dispatch(
        getCustomFieldByOrgId(
          { fieldCategoryName: null },
          {
            orgId,
          },
          innerLogDetails
        )
      );
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

///////////custom email//////////////

//get - custom emails
export const getCustomEmails = (orgId, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });
      const response = await get(
        getCustomEmailsUrl(),
        orgId ? { orgId } : undefined
      );
      dispatch({ type: GET_CUSTOM_EMAILS, payload: response?.data?.data });
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      dispatch({ type: LOADING, payload: false });
    }
  };
};

//get - custom email categories
export const getCustomEmailCategories = (params, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_CUSTOM_EMAIL_CATEGORIES,
        payload: null,
      });
      const response = await get(getCustomEmailCategoriesUrl(), params);
      dispatch({
        type: GET_CUSTOM_EMAIL_CATEGORIES,
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

//post - custom emails
export const submitCustomEmail = (data, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await post(getSubmitCustomEmailUrl(), data);
      dispatch(
        setToastNotification(
          SUCCESS,
          "Custom Email Created Successfully!",
          logDetails
        )
      );

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "submitCustomEmail"
      );

      dispatch(getCustomEmails(data.hrOrgId, innerLogDetails));
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

//delete - custom email
export const deleteCustomEmail = (orgId, id, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await deleteMethod(getDeleteEditCustomEmailUrl(id));
      dispatch(
        setToastNotification(
          SUCCESS,
          "Custom Email Deleted Successfully!",
          logDetails
        )
      );

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "deleteCustomEmail"
      );

      dispatch(getCustomEmails(orgId, innerLogDetails));
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

//put - custom email
export const EditCustomEmail = (data, emailId, orgId, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await put(getDeleteEditCustomEmailUrl(emailId), data);
      dispatch(
        setToastNotification(
          SUCCESS,
          "Custom Email Updated Successfully!",
          logDetails
        )
      );

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "EditCustomEmail"
      );

      dispatch(getCustomEmails(orgId, innerLogDetails));
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

///////////consent form//////////////

//get - consent emails
export const getConsentEmails = (params, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });
      const response = await get(
        getConsentEmailsUrl(),
        params?.orgId
          ? {
              orgId: params?.orgId,
              pkgId: params?.packageId,
            }
          : undefined
      );
      dispatch({ type: GET_CONSENT_EMAILS, payload: response?.data?.data });
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      dispatch({ type: LOADING, payload: false });
    }
  };
};

//post - consent email
export const submitConsentEmail = (data, params, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await post(getConsentEmailsUrl(), data, params);
      dispatch(
        setToastNotification(
          SUCCESS,
          "Consent Form Created Successfully!",
          logDetails
        )
      );

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "submitConsentEmail"
      );

      dispatch(
        getConsentEmails(
          {
            orgId: params.orgId,
            packageId: "",
          },
          innerLogDetails
        )
      );
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

//delete - consent email
export const deleteConsentEmail = (orgId, id, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await deleteMethod(getDeleteEditConsentEmailUrl(id));
      dispatch(
        setToastNotification(
          SUCCESS,
          "Consent Form Deleted Successfully!",
          logDetails
        )
      );

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "deleteConsentEmail"
      );

      dispatch(getConsentEmails({ orgId, packageId: "" }, innerLogDetails));
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

//put - consent email
export const EditConsentEmail = (data, id, orgId, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await put(getDeleteEditConsentEmailUrl(id), data);
      dispatch(
        setToastNotification(
          SUCCESS,
          "Consent Form Updated Successfully!",
          logDetails
        )
      );

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "EditConsentEmail"
      );

      dispatch(
        getConsentEmails(
          {
            orgId,
            packageId: "",
          },
          innerLogDetails
        )
      );
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

///////////message settings//////////////

export const getOrgOtherSettings = (orgId, logDetails) => {
  return async (dispatch) => {
    try {
      const res = await get(getOrgOtherSettingsUrl(orgId));

      dispatch({ type: GET_ORG_MSG_METHOD_STATUS, payload: res.data.data });
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

export const updateOrgOtherSettings = (data, orgId, logDetails) => {
  return async (dispatch) => {
    try {
      const res = await put(getOrgOtherSettingsUrl(orgId), data);
      dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "updateOrgOtherSettings"
      );

      dispatch(getOrgOtherSettings(orgId, innerLogDetails));
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

///////////research countries settings//////////////

//get research countries settings
export const getAllowedResearchCountriesSettings = (
  hrOrganizationId,
  logDetails
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_ALLOWED_RESEARCH_COUNTRIES_SETTING_DATA,
        payload: null,
      });
      const res = await get(getAllowedResearchCountriesSettingsUrl(), {
        hrOrganizationId,
      });

      dispatch({
        type: GET_ALLOWED_RESEARCH_COUNTRIES_SETTING_DATA,
        payload: res?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: GET_ALLOWED_RESEARCH_COUNTRIES_SETTING_DATA,
        payload: [],
      });
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

//update allowed research countries settings
export const updateAllowedResearchCountriesSettings = (
  data,
  hrOrganizationId,
  runCustom,
  logDetails
) => {
  return async (dispatch) => {
    try {
      if (data?.countryIds?.length) {
        const res = await put(
          updateAllowedResearchCountriesSettingsUrl(),
          data,
          {
            hrOrganizationId,
          }
        );

        dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));

        //logic to remove those jurisdiction countries from research countries in default research
        //countries setting which are not present in the allowed research countries settings

        //old default research countries data
        let researchCountryJuridictionScope = store
          .getState()
          ?.systemAdmin?.orgsLists?.find(
            (curr) => curr?.hrOrganizationsId === hrOrganizationId
          )?.researchCountryJuridictionScope;

        //updated allowed research countries
        let updatedCountryLists = data?.countryIds;

        //filtering out non-existent countries from old default research countries data
        let updatedJurisdictionId =
          researchCountryJuridictionScope?.jurisdictionId?.filter((id) =>
            updatedCountryLists?.find((countryId) => countryId === id)
          );

        //if filtered countries turns out to be empty , we will make allJurisdictionSearch value to true
        researchCountryJuridictionScope = {
          noOfYearsForAdditionalJuridictionSearch:
            researchCountryJuridictionScope?.researchCountryJuridictionScope ||
            3,
          jurisdictionId: updatedJurisdictionId || [],
          allJurisdictionSearch: Boolean(!updatedJurisdictionId?.length),
        };

        //updating with final updated value
        let innerLogDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "updateAllowedResearchCountriesSettings"
        );

        dispatch(
          updateDefaultResearchCountriesSettings(
            innerLogDetails,
            researchCountryJuridictionScope,
            hrOrganizationId,
            () => {},
            false
          )
        );
      } else {
        dispatch(
          setToastNotification(
            ERROR,
            "Please select atleast 1 country",
            logDetails
          )
        );
      }
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    } finally {
      runCustom();
    }
  };
};

//update default research countries settings
export const updateDefaultResearchCountriesSettings = (
  logDetails,
  data,
  orgId,
  runCustom,
  showSuccessMsg = true
) => {
  return async (dispatch) => {
    try {
      const res = await put(getUpdateResearchCountriesUrl(orgId), data);
      if (showSuccessMsg) {
        dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));
      }

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "updateDefaultResearchCountriesSettings"
      );

      dispatch(getOrgsLists(innerLogDetails));
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    } finally {
      runCustom();
    }
  };
};

//////////update relationship/////////////////
export const updateRelationshipDetails = (data, orgId, logDetails) => {
  return async (dispatch) => {
    try {
      const res = await put(getUpdateRelationshipUrl(), data, {
        orgId,
      });

      dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

export const getRelationshipDetails = (orgId, logDetails) => {
  return async (dispatch) => {
    try {
      if (orgId) {
        dispatch({ type: GET_ORG_RELATIONSHIP, payload: null });

        const res = await get(getRelationshipDetailsUrl(), {
          orgId,
        });
        dispatch({ type: GET_ORG_RELATIONSHIP, payload: res?.data?.data });
      } else {
        dispatch({ type: GET_ORG_RELATIONSHIP, payload: [] });
      }
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

///////////////additional email settings////////////////////////////////

//get - additional email details
export const getAdditionalEmailDetails = (hrOrganizationId, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });
      dispatch({ type: GET_ADDITIONAL_EMAIL_SETTINGS_DATA, payload: null });

      const res = await get(
        getAdditionalEmailDetailsUrl(),
        hrOrganizationId ? { hrOrganizationId } : undefined
      );
      dispatch({
        type: GET_ADDITIONAL_EMAIL_SETTINGS_DATA,
        payload: res?.data?.data,
      });
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    } finally {
      dispatch({ type: LOADING, payload: false });
    }
  };
};

//post - additional email details
export const postAdditionalEmailDetails = (
  payload,
  hrOrganizationId,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const res = await post(getPostAdditionalEmailDetailsUrl(), payload, {
        hrOrganizationId,
      });
      dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "postAdditionalEmailDetails"
      );

      dispatch(getAdditionalEmailDetails(hrOrganizationId, innerLogDetails));
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

//put - additional email details
export const putAdditionalEmailDetails = (
  payload,
  hrOrganizationId,
  hrOrganizationAdditionalEmailSettingId,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const res = await put(getPutAdditionalEmailDetailsUrl(), payload, {
        hrOrganizationId,
        hrOrganizationAdditionalEmailSettingId,
      });
      dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "putAdditionalEmailDetails"
      );

      dispatch(getAdditionalEmailDetails(hrOrganizationId, innerLogDetails));
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

//delete - additional email details
export const deleteAdditionalEmailDetails = (
  hrOrganizationAdditionalEmailSettingId,
  orgId,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const res = await deleteMethod(
        getDeleteAdditionalEmailDetailsUrl(),
        null,
        {
          hrOrganizationAdditionalEmailSettingId,
        }
      );
      dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "deleteAdditionalEmailDetails"
      );

      dispatch(getAdditionalEmailDetails(orgId, innerLogDetails));
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

//////// email provider settings /////////

//get email provider
export const getEmailProviderSetting = (logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_EMAIL_PROVIDER_SETTING, payload: null });
      const res = await get(getEmailProviderSettingUrl());
      dispatch({
        type: GET_EMAIL_PROVIDER_SETTING,
        payload: res?.data?.data,
      });
    } catch (error) {
      dispatch({ type: GET_EMAIL_PROVIDER_SETTING, payload: [] });
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

//put email provider
export const updateEmailProviderSetting = (providerId, logDetails) => {
  return async (dispatch) => {
    try {
      const res = await put(
        getUpdateEmailProviderSettingUrl(),
        {},
        {
          providerId,
        }
      );
      dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

////// additional check settings /////////

//get check settings
export const getAdditionalCheckSettings = (hrOrganizationId, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: LOADING,
        payload: true,
      });

      const res = await get(getAdditionalCheckSettingsUrl(), {
        hrOrganizationId,
      });
      dispatch({
        type: GET_ADDITIONAL_CHECKS_SETTING_DATA,
        payload: res?.data?.data,
      });
      dispatch({
        type: LOADING,
        payload: false,
      });
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
      dispatch({
        type: LOADING,
        payload: false,
      });
    }
  };
};

//update check settings
export const updateAdditionalCheckSettings = (
  data,
  hrOrganizationId,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const res = await put(updateAdditionalCheckSettingsUrl(), data, {
        hrOrganizationId,
      });

      dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

////// remove permissions /////////

//get remove permission data
export const getRemovalPermissionsData = (
  hrOrganizationId,
  permissionType,
  logDetails
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: LOADING,
        payload: true,
      });

      const res = await get(getRemovalPermissionsDataUrl(), {
        hrOrganizationId,
        permissionType,
      });

      let data = res?.data?.data;

      if (data?.length) {
        data[0].permissionType = permissionType;
      }

      dispatch({
        type: GET_REMOVAL_PERMISSIONS_DATA,
        payload: data,
      });
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    } finally {
      dispatch({
        type: LOADING,
        payload: false,
      });
    }
  };
};

//get permission as per permissions type
export const getPermissionsPerPermissionType = (
  permissionType,
  subRoleId,
  logDetails
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: PERMISSION_TYPE_LOADING, payload: true });

      dispatch({
        type: GET_PERMISSIONS_DATA_AS_PER_PERMISSION_TYPE,
        payload: null,
      });

      const res = await get(getPermissionsPerPermissionTypeUrl(), {
        permissionType,
        subRoleId,
      });

      dispatch({
        type: GET_PERMISSIONS_DATA_AS_PER_PERMISSION_TYPE,
        payload: res?.data?.data,
      });
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    } finally {
      dispatch({ type: PERMISSION_TYPE_LOADING, payload: false });
    }
  };
};

//add removal of permission
export const addRemovalPermissionsData = (
  hrOrganizationId,
  data,
  runCustom,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const res = await post(getAddRemovalPermissionsDataUrl(), data, {
        hrOrganizationId,
      });
      dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "addRemovalPermissionsData"
      );

      dispatch(
        getRemovalPermissionsData(
          hrOrganizationId,
          data?.permissionType,
          innerLogDetails
        )
      );
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    } finally {
      runCustom();
    }
  };
};

//delete removal of permission
export const deleteRemovalPermissionsData = (
  params,
  runWhenSuccess,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const res = await deleteMethod(
        getDeleteRemovalPermissionsDataUrl(),
        {},
        params
      );
      dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));

      runWhenSuccess();
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

///////////////// candidate registration field settings ///////////////

//get
export const getRegisterCandidateFieldSettings = (id, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_CANDIDATE_REGISTRATION_FIELD_SETTINGS,
        payload: null,
      });
      let res = await get(getRegisterCandidateFieldSettingsUrl(id));
      dispatch({
        type: GET_CANDIDATE_REGISTRATION_FIELD_SETTINGS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: GET_CANDIDATE_REGISTRATION_FIELD_SETTINGS,
        payload: [],
      });
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

//update
export const updateRegisterCandidateFieldSettings = (
  data,
  id,
  runCustom,
  logDetails
) => {
  return async (dispatch) => {
    try {
      let res = await put(updateRegisterCandidateFieldSettingsUrl(id), data);
      dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    } finally {
      runCustom();
    }
  };
};
