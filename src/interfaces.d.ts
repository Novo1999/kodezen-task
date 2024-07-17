interface SearchProp {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}

interface GroupedSelectProp extends SelectProp {
  value: string
  handleSelect: (e: ChangeEvent<HTMLSelectElement>) => void
  clearValue: () => void
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void
  searchTerm: string
}
