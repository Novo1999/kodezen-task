import Select from './components/Select'

const OPTIONS = [
  'HTML',
  'CSS',
  'JS',
  'REACT',
  'NEXT.JS',
  'Typescript',
  'Framer Motion',
]

function App() {
  return (
    <main className='flex__center full__height'>
      <h1>SELECT Component</h1>
      <Select options={OPTIONS} />
    </main>
  )
}

export default App
