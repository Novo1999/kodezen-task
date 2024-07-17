import { ChangeEvent } from 'react'
import './search.css'

interface SearchProp {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}

const Search = ({ value, onChange, disabled }: SearchProp) => {
  return (
    <input
      className='kzui-search'
      name='text'
      placeholder='Search...'
      type='search'
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  )
}
export default Search
