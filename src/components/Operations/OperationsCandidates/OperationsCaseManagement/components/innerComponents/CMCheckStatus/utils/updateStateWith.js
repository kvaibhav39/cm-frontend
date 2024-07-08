export const updateStateWith = (
  setState,
  id,
  newVal,
  updateDisableStateDirectly = false
) =>
  updateDisableStateDirectly
    ? setState(() => newVal)
    : setState((prev) => {
        const temp = { ...prev };
        temp[id] = newVal;
        return temp;
      });
