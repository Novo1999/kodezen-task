import { ChangeEvent, useState } from 'react'

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
  onSearchHandler?: () => void
}

const Select = ({ ...prop }: SelectProp) => {
  const { isClearable, isDisabled, options, placeholder, isGrouped, isMulti } =
    prop
  const [value, setValue] = useState('')

  // throws an error if isGrouped is true and options are string of array or numbers
  errorThrower(isGrouped as boolean, options as string[])

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value)
  }

  const clearValue = () => {
    setValue('')
  }

  const clearButtonEnabled = isClearable && !isDisabled

  if (isGrouped) {
    return (
      <GroupedSelect
        {...prop}
        clearValue={clearValue}
        clearButtonEnabled={true}
        value={value}
        handleChange={handleChange}
        options={options}
      />
    )
  }

  if (isMulti) {
    return (
      <MultiSelect
        {...prop}
        clearButtonEnabled={clearButtonEnabled as boolean}
        options={options}
      />
    )
  }

  return (
    <div className={`kzui-select ${isDisabled ? 'kzui-select--disabled' : ''}`}>
      <select
        className='kzui-select__input'
        value={value}
        disabled={isDisabled}
        onChange={handleChange}
      >
        {placeholder && <option value=''>{placeholder}</option>}
        {options.map((option) => (
          <option key={option as string} value={option as string}>
            {checkSelected(option as string, value)} {option as string}
          </option>
        ))}
      </select>
      {clearButtonEnabled && (
        <button className='kzui-clear__button' onClick={clearValue}>
          Clear
        </button>
      )}
    </div>
  )
}

export default Select

const GroupedSelect = ({
  value,
  handleChange,
  clearButtonEnabled,
  clearValue,
  ...prop
}: SelectProp & {
  value: string
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void
  clearButtonEnabled: boolean
  clearValue: () => void
}) => {
  const { isDisabled, options, placeholder } = prop
  return (
    <div className={`kzui-select ${isDisabled ? 'kzui-select--disabled' : ''}`}>
      <select
        className='kzui-select__input'
        value={value}
        disabled={isDisabled}
        onChange={handleChange}
      >
        {placeholder && <option value=''>{placeholder}</option>}
        {(options as GroupedOption).map((item) => {
          return (
            <optgroup key={item.group} label={item.group}>
              {item.options.map((option) => {
                return (
                  <option key={option} value={option}>
                    {checkSelected(option, value)} {option}
                  </option>
                )
              })}
            </optgroup>
          )
        })}
      </select>
      {clearButtonEnabled && (
        <button className='kzui-clear__button' onClick={clearValue}>
          Clear
        </button>
      )}
    </div>
  )
}

const MultiSelect = ({
  clearButtonEnabled,
  ...prop
}: SelectProp & {
  clearButtonEnabled: boolean
}) => {
  const [values, setValues] = useState<Set<string>>(new Set([]))
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { isDisabled, options, placeholder } = prop

  const handleSelect = (value: string) => {
    setValues((prevValues) => {
      const updatedValues = new Set(prevValues)
      if (updatedValues.has(value)) {
        updatedValues.delete(value)
      } else {
        updatedValues.add(value)
      }
      return updatedValues
    })
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const clearValue = () => {
    setValues(new Set([]))
  }

  return (
    <div
      className={`kzui-multi-select ${
        isDisabled ? 'kzui-multi-select--disabled' : ''
      }`}
    >
      <div className='kzui-multi-select__control' onClick={toggleDropdown}>
        <div className='kzui-multi-select__selected'>
          {values.size > 0
            ? Array.from(values).join(', ')
            : placeholder || 'Select'}
        </div>
        <div
          className={`kzui-multi-select__arrow ${dropdownOpen ? 'open' : ''}`}
        ></div>
      </div>
      {dropdownOpen && (
        <ul className='kzui-multi-select'>
          {(options as string[]).map((option) => (
            <li
              key={option}
              className={`kzui-multi-select__option ${
                values.has(option) ? 'selected' : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {checkSelectedForMultiSelect(option, values)} {option}
            </li>
          ))}
        </ul>
      )}
      {clearButtonEnabled && values.size > 0 && (
        <button className='kzui-clear__button' onClick={clearValue}>
          Clear
        </button>
      )}
    </div>
  )
}

// Adds a check mark icon beside the option
const checkSelected = (option: string, value: string) => {
  if (option === value) {
    return '✅'
  } else {
    return null
  }
}

// for multi select
const checkSelectedForMultiSelect = (option: string, values: Set<string>) => {
  if (values.has(option)) {
    return '✅'
  } else {
    return null
  }
}

const errorThrower = (isGrouped: boolean, values: string[]) => {
  if (
    isGrouped &&
    values.every(
      (value) => typeof value === 'string' || typeof value === 'number'
    )
  ) {
    throw new Error('Cannot use string of array in multiple value component')
  }
}
