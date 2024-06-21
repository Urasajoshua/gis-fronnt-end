import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FaultReportForm from './FaultsReport'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FaultReportForm/>
    </>
  )
}

export default App
