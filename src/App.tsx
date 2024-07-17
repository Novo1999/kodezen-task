import Select from './components/select'

function App() {
  return (
    <main className='kzui-flex__center kzui-full__height kzui-bg__blue'>
      <h1>SELECT Component</h1>
      <Select options={OPTIONS} isMulti isClearable />
    </main>
  )
}

export default App

const OPTIONS = [
  'HTML',
  'CSS',
  'JS',
  'REACT',
  'NEXT.JS',
  'Typescript',
  'Framer Motion',
]

const OPTIONS_GROUP = [
  {
    group: 'frontend',
    options: ['React.JS', 'Next.JS', 'TypeScript', 'TailwindCSS'],
  },
  {
    group: 'backend',
    options: ['Node.JS', 'Express.JS', 'Mongoose'],
  },
]
