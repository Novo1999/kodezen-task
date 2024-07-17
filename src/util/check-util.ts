export // Adds a check mark icon beside the option
const checkSelected = (option: string, value: string) => {
  if (option.toLowerCase() === value.toLowerCase()) {
    return '✅'
  } else {
    return null
  }
}

// for multi select
export const checkSelectedForMultiSelect = (
  option: string,
  values: Set<string>
) => {
  if (values.has(option)) {
    return '✅'
  } else {
    return null
  }
}
