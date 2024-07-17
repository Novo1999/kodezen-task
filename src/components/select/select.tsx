import { ChangeEvent, MouseEvent, useMemo, useState } from 'react'
import Search from '../search/search'
import './select.css'

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
  value?: string
}

const Select = ({ ...prop }: SelectProp) => {
  const {
    isClearable,
    isDisabled,
    options,
    placeholder,
    isGrouped,
    isMulti,
    isSearchable,
    value,
  } = prop
  const [stateValue, setStateValue] = useState(value ?? '')
  const [searchTerm, setSearchTerm] = useState('')

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setStateValue(e.target.value)
    setSearchTerm('')
  }

  const clearValue = () => {
    setStateValue('')
  }

  const clearButtonEnabled = isClearable && !isDisabled

  const filteredOptions = useMemo(() => {
    if (!isGrouped && !isMulti) {
      return options.filter((option) =>
        (option as string).toLowerCase().includes(searchTerm.toLowerCase())
      )
    } else {
      return []
    }
  }, [options, searchTerm, isGrouped, isMulti])

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const multiSelectResultCount = useMemo(() => {
    return `${filteredOptions.length} result${
      filteredOptions.length > 1 ? 's' : ''
    }`
  }, [filteredOptions.length])

  if (isGrouped) {
    return (
      <GroupedSelect
        {...prop}
        clearValue={clearValue}
        value={stateValue}
        handleSelect={handleSelect}
        options={options}
        handleSearch={handleSearch}
        searchTerm={searchTerm}
      />
    )
  } else if (isMulti) {
    return <MultiSelect {...prop} />
  } else {
    return (
      <>
        {isSearchable && (
          <Search
            value={searchTerm}
            onChange={handleSearch}
            disabled={isDisabled as boolean}
          />
        )}
        <div
          className={`kzui-select ${isDisabled ? 'kzui-select--disabled' : ''}`}
        >
          <select
            className='kzui-select__input'
            value={value}
            disabled={isDisabled}
            onChange={handleSelect}
          >
            {!searchTerm && <option>{placeholder ?? 'Select Option'}</option>}
            {searchTerm && <option value=''>{multiSelectResultCount}</option>}
            {(filteredOptions as string[]).map((option) => {
              const checkIcon = checkSelected(option!, stateValue)
              return (
                <option id={option} key={option} value={option}>
                  {checkIcon} {option}
                </option>
              )
            })}
          </select>
          {clearButtonEnabled && !!value && (
            <button className='kzui-clear__button' onClick={clearValue}>
              Clear
            </button>
          )}
        </div>
      </>
    )
  }
}

export default Select

interface GroupedSelectProp extends SelectProp {
  value: string
  handleSelect: (e: ChangeEvent<HTMLSelectElement>) => void
  clearValue: () => void
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void
  searchTerm: string
}

const GroupedSelect = ({
  value,
  handleSelect,
  clearValue,
  handleSearch,
  searchTerm,
  ...prop
}: GroupedSelectProp) => {
  const {
    isDisabled,
    options,
    placeholder,
    isSearchable,
    isGrouped,
    isClearable,
  } = prop
  const clearButtonEnabled = isClearable && !isDisabled
  // throws an error if isGrouped is true and options are string of array or numbers
  errorThrowerGroupSelect(isGrouped as boolean, options as string[])

  const filteredOptions = useMemo(() => {
    return (options as GroupedOption).filter((item) => {
      const itemGroupMatchesWithSearchTerm = item.group.includes(
        searchTerm.toLowerCase()
      )

      const itemOptionsMatchesWithSearchTerm = item.options.find((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )

      return itemOptionsMatchesWithSearchTerm || itemGroupMatchesWithSearchTerm
    })
  }, [searchTerm, options])

  return (
    <>
      {isSearchable && (
        <Search
          value={searchTerm}
          onChange={handleSearch}
          disabled={isDisabled as boolean}
        />
      )}
      <div
        className={`kzui-select ${isDisabled ? 'kzui-select--disabled' : ''}`}
      >
        <select
          className='kzui-select__input'
          value={value}
          disabled={isDisabled}
          onChange={handleSelect}
        >
          <option>{placeholder ?? 'Select Option'}</option>
          {(filteredOptions as GroupedOption).map((item) => {
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
    </>
  )
}

const MultiSelect = ({ ...prop }: SelectProp) => {
  const [values, setValues] = useState<Set<string>>(new Set([]))
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { isDisabled, options, placeholder, isClearable, isMulti } = prop
  const clearButtonEnabled = isClearable && !isDisabled

  // for inappropriate data structure throw error
  errorThrowerMultiSelect(isMulti!, options as string[])

  const handleSelect = (value: string) => {
    setValues((prevValues) => {
      const updatedValues = new Set(prevValues)
      updatedValues.add(value)
      return updatedValues
    })
  }

  const toggleDropdown = () => {
    if (!isDisabled) {
      setDropdownOpen(!dropdownOpen)
    }
  }

  const clearValue = (e: MouseEvent<HTMLButtonElement>, option: string) => {
    e.stopPropagation()
    setValues((prevValues) => {
      const updatedValues = new Set(prevValues)
      if (updatedValues.has(option)) {
        updatedValues.delete(option)
      }
      return updatedValues
    })
  }

  const selectedValuesJoined = Array.from(values).join(', ')
  const hasValues = values.size > 0
  const disabledStyle = isDisabled ? 'kzui-multi-select--disabled' : ''

  const placeholderText = useMemo(() => {
    if (hasValues) {
      return selectedValuesJoined
    } else if (!hasValues) {
      return placeholder
    } else {
      return 'Select'
    }
  }, [hasValues, placeholder, selectedValuesJoined])

  const dropdownOpenStyle = dropdownOpen ? 'open' : ''

  return (
    <div className={`kzui-multi-select ${disabledStyle}`}>
      <div className='kzui-multi-select__control' onClick={toggleDropdown}>
        <div className='kzui-multi-select__selected'>{placeholderText}</div>
        <div className={`kzui-multi-select__arrow ${dropdownOpenStyle}`}></div>
      </div>
      {dropdownOpen && !isDisabled && (
        <ul className='kzui-multi-select'>
          {(options as string[]).map((option) => {
            const checkIcon = checkSelectedForMultiSelect(option, values)
            const handleClearValue = (e: MouseEvent<HTMLButtonElement>) => {
              return clearValue(e, option)
            }

            return (
              <li
                key={option}
                className={`kzui-multi-select__option ${
                  values.has(option) ? 'selected' : ''
                }`}
                onClick={() => handleSelect(option)}
              >
                <p>
                  {checkIcon} {option}
                </p>
                {clearButtonEnabled && values.has(option) && (
                  <button
                    className='kzui-clear__button'
                    onClick={handleClearValue}
                  >
                    Clear
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// Adds a check mark icon beside the option
const checkSelected = (option: string, value: string) => {
  if (option.toLowerCase() === value.toLowerCase()) {
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

const errorThrowerGroupSelect = (isGrouped: boolean, values: string[]) => {
  if (
    isGrouped &&
    values.every(
      (value) => typeof value === 'string' || typeof value === 'number'
    )
  ) {
    throw new Error('Cannot use string of array in grouped value component')
  }
}

const errorThrowerMultiSelect = (isMulti: boolean, values: string[]) => {
  if (
    isMulti &&
    !values.every(
      (value) => typeof value === 'string' || typeof value === 'number'
    )
  ) {
    throw new Error(
      'Cannot use this data structure in multiple value component'
    )
  }
}
