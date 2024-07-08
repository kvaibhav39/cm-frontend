export const getOrgMsgMethodById = (orgMsgMethodStatus,id) =>{
    return orgMsgMethodStatus?.messageMethods?.find(
        (curr) => curr?.messageMethodId === id
      )
}