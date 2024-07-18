import { ChangeEvent, MouseEvent, useMemo, useState } from 'react'
import {
  checkSelected,
  checkSelectedForMultiSelect,
} from '../../util/check-util'
import {
  groupedSelectErrorHandler,
  multiSelectErrorHandler,
} from '../../util/error-handler'
import Search from '../search/search'
import './select.css'

const Select = ({ ...prop }: SelectProp) => {
  const {
    isClearable,
    isDisabled,
    options,
    placeholder,
    isGrouped,
    isMulti,
    isSearchable,
    onChangeHandler,
    value,
    onMenuOpen,
    onSearchHandler,
  } = prop
  const [stateValue, setStateValue] = useState(value ?? '')
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    if (onMenuOpen) {
      onMenuOpen()
      setIsOpen(true)
    } else {
      setIsOpen(true)
    }
  }

  const handleSelect = (e: ChangeEvent<HTMLSelectElement> | string) => {
    // if handler prop passed, use that
    if (onChangeHandler && typeof e === 'string') {
      onChangeHandler(e)
    } else {
      setStateValue((e as ChangeEvent<HTMLSelectElement>).target.value)
    }
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
    if (onSearchHandler) {
      onSearchHandler(e)
      setSearchTerm((e as ChangeEvent<HTMLInputElement>).target.value)
    } else {
      setSearchTerm((e as ChangeEvent<HTMLInputElement>).target.value)
    }
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
        isOpen={isOpen}
        handleOpen={handleOpen}
      />
    )
  } else if (isMulti) {
    return (
      <MultiSelect
        {...prop}
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        isOpen={isOpen}
        handleOpen={handleOpen}
      />
    )
  } else {
    const hasValue = !!stateValue
    return (
      <>
        {isSearchable && isOpen && (
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
            onClick={handleOpen}
            className='kzui-select__input'
            value={value}
            disabled={isDisabled}
            onChange={handleSelect}
          >
            {!searchTerm && <option>{placeholder ?? 'Select Option'}</option>}
            {searchTerm && <option>{multiSelectResultCount}</option>}
            {(filteredOptions as string[]).map((option) => {
              const checkIcon = checkSelected(option!, stateValue)
              return (
                <option id={option} key={option} value={option}>
                  {checkIcon} {option}
                </option>
              )
            })}
          </select>
          {clearButtonEnabled && hasValue && (
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

const GroupedSelect = ({
  value,
  handleSelect,
  clearValue,
  handleSearch,
  searchTerm,
  isOpen,
  handleOpen,
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
  groupedSelectErrorHandler(isGrouped as boolean, options as string[])

  // for search
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

  const multiSelectResultCount = useMemo(() => {
    return `${filteredOptions.length} result${
      filteredOptions.length > 1 ? 's' : ''
    }`
  }, [filteredOptions.length])

  const valueSelected = !!value

  return (
    <>
      {isSearchable && isOpen && (
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
          onClick={handleOpen}
          className='kzui-select__input'
          value={value}
          disabled={isDisabled}
          onChange={handleSelect}
        >
          {!searchTerm && <option>{placeholder ?? 'Select Option'}</option>}
          {searchTerm && <option value=''>{multiSelectResultCount}</option>}
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
        {clearButtonEnabled && valueSelected && (
          <button className='kzui-clear__button' onClick={clearValue}>
            X
          </button>
        )}
      </div>
    </>
  )
}

const MultiSelect = ({ ...prop }: MultiSelectProp) => {
  const [values, setValues] = useState<Set<string>>(new Set([]))
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const {
    isDisabled,
    options,
    placeholder,
    isClearable,
    isMulti,
    isSearchable,
    searchTerm,
    handleSearch,
    isOpen,
    handleOpen,
  } = prop
  const clearButtonEnabled = isClearable && !isDisabled

  // for inappropriate data structure throw error
  multiSelectErrorHandler(isMulti!, options as string[])

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
      handleOpen()
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

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      (option as string).toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [options, searchTerm])

  const multiSelectResultCount = useMemo(() => {
    return `${filteredOptions.length} result${
      filteredOptions.length > 1 ? 's' : ''
    }`
  }, [filteredOptions.length])

  return (
    <>
      {isSearchable && isOpen && (
        <Search
          value={searchTerm}
          onChange={handleSearch}
          disabled={isDisabled as boolean}
        />
      )}
      <div className={`kzui-multi-select ${disabledStyle}`}>
        <div className='kzui-multi-select__control' onClick={toggleDropdown}>
          {searchTerm ? (
            <p>{multiSelectResultCount}</p>
          ) : (
            <div className='kzui-multi-select__selected'>{placeholderText}</div>
          )}

          <div
            className={`kzui-multi-select__arrow ${dropdownOpenStyle}`}
          ></div>
        </div>
        {dropdownOpen && !isDisabled && (
          <ul className='kzui-multi-select'>
            {(filteredOptions as string[]).map((option) => {
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
                      X
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
