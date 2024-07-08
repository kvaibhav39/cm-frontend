export const replacingDropdownId = (actionLogCategoriesInputs,categoryInputValues,currencies) =>{
    //replace dropdown id with dropdown string.
    //Separately doing this instead of adding it above because the above loop is looped inside
    //'Object.keys(finalObj).forEach' which is dependant upon finalObj which may or may not contain
    //the dropdown fields as per the condition at line 74.
    actionLogCategoriesInputs?.forEach((catDetails) => {
        if (catDetails?.categoryInputTypeId === 2) {
          let temp = catDetails?.actionLogCategoryInputFieldsL1Data?.find(
            (curr) =>
              categoryInputValues[catDetails?.categoryInputName] === curr?.id
          )?.categoryInputFieldNameL1;
          categoryInputValues[catDetails?.categoryInputName] = temp;
        }
  
        //replace currency id to currency name
        if (catDetails?.categoryInputTypeId === 8) {
          let selectedCurrency = currencies?.find(
            (curr) =>
              curr.currencyMasterId ===
              categoryInputValues[catDetails?.categoryInputName]
          );
  
          if (selectedCurrency) {
            categoryInputValues[
              catDetails?.categoryInputName
            ] = `${selectedCurrency?.CurrencyName} (${selectedCurrency?.CurrencyISOCode})`;
          }
        }
      });
}