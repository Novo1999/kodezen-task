type GroupedOption = { group: string; options: string[] }[]

type SelectProp = {
  isClearable?: boolean
  isSearchable?: boolean
  isDisabled?: boolean
  options: string[] | GroupedOption
  placeholder?: string
  isGrouped?: boolean
  isMulti?: boolean
  onChangeHandler?: (value: string) => void
  onMenuOpen?: () => void
  onSearchHandler?: (value: ChangeEvent<HTMLInputElement>) => void
  value?: string
}
