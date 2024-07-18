import Select from './components/select/select'
import { OPTIONS, OPTIONS_GROUP } from './util/constants'

function App() {
  // const [value, setValue] = useState('')
  // const [menuOpen, setMenuOpen] = useState(false)
  // const [search, setSearch] = useState('')

  return (
    <main className='kzui-flex__start kzui-full__height kzui-bg__blue'>
      <section>
        <h3>Searchable Clearable Select Component</h3>
        <Select
          // onSearchHandler={(e) => setSearch(e.target.value)} can use search handler like this
          // onMenuOpen={() => setMenuOpen(!menuOpen)} can pass this to control the component
          // value={value} can pass state value
          // onChangeHandler={(e) => setValue(e.target.value)} // can change value like this too
          options={OPTIONS}
          placeholder='Technologies'
          isSearchable
          isClearable
        />
      </section>
      <section>
        <h3>Grouped Searchable Clearable Select Component</h3>
        <Select
          options={OPTIONS_GROUP}
          placeholder='Technologies'
          isGrouped
          isSearchable
          isClearable
        />
      </section>
      <section>
        <h3>Multi Select Clearable Component</h3>
        <Select
          isMulti
          options={OPTIONS}
          placeholder='Technologies'
          isClearable
        />
      </section>
      <section>
        <h3>Multi Searchable Clearable Select Component</h3>
        <Select
          options={OPTIONS}
          placeholder='Technologies'
          isMulti
          isSearchable
          isClearable
        />
      </section>
    </main>
  )
}

export default App
