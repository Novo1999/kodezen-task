import Select from './components/select/select'
import { OPTIONS, OPTIONS_GROUP } from './util/constants'

function App() {
  return (
    <main className='kzui-flex__center kzui-full__height kzui-bg__blue'>
      <h1>SELECT Component</h1>
      <Select
        options={OPTIONS}
        placeholder='Technologies'
        isMulti
        isSearchable
        isClearable
      />
    </main>
  )
}

export default App
