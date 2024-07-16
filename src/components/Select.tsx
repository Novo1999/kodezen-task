type SelectProp = {
  isClearable?: boolean
  isSearchable?: boolean
  isDisabled?: boolean
  options: string[]
  placeholder?: string
  isGrouped?: boolean
  isMulti?: boolean
  onChangeHandler?: () => void
  onMenuOpen?: () => void
  onSearchHandler?: () => void
}

const Select = ({ ...props }: SelectProp) => {
  const { isDisabled, options, placeholder } = props

  return (
    <div className={`select ${isDisabled ? 'select--disabled' : ''}`}>
      <select
        className='select__input'
        name='cars'
        id='cars'
        disabled={isDisabled}
        onChange={props.onChangeHandler}
      >
        {placeholder && <option value=''>{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
