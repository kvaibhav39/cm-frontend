import * as Yup from "yup";

export const removePermissionsSchema = Yup.object().shape(
  {
    permissionType: Yup.string()
      .required("Field is required!")
      .typeError("Field is required!"),
    roleId: Yup.number()
      .nullable()
      .typeError("Field is required!")
      .required("Field is required!"),
    subRoleId: Yup.number()
      .nullable()
      .typeError("Field is required!")
      .required("Field is required!"),
    permissionsActionsId: Yup.number()
      .nullable()
      .when("permissionsPagesId", {
        is: (permissionsPagesId) => {
          if (permissionsPagesId) {
            return false;
          }
          return true;
        },
        then: (schema) =>
          schema.required("Field is required!").typeError("Field is required!"),
      }),

    permissionsPagesId: Yup.number()
      .nullable()
      .when("permissionsActionsId", {
        is: (permissionsActionsId) => {
          if (permissionsActionsId) {
            return false;
          }
          return true;
        },
        then: (schema) =>
          schema.required("Field is required!").typeError("Field is required!"),
      }),
  },
  [
    ["permissionsActionsId", "permissionsPagesId"],
    ["permissionsPagesId", "permissionsActionsId"],
  ]
);
