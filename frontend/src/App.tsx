import './App.css'
import Spotify from './components/Spotify'

function App() {

  return (
    <div className='min-h-screen bg-white flex flex-col gap-4 justify-center align-center'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-3xl font-bold'>Song Grader</h1>
        <p className='text-sm text-gray-500 mt-4'>Song grader classifies a song if it is positive or negative.</p>
      </div>
      <Spotify />
    </div>
  )
}

export default App
