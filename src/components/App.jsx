import { useState, useEffect } from 'react'
import '../App.css'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

function App() {
  const [DIYs, setDIYs] = useState([])
  

  useEffect(function() {
    fetch("http://localhost:3000/DIYs")
    .then(response => response.json())
    .then(DIYsData => setDIYs(DIYsData))
  },[])

  return (
    <>
      <NavBar/>
      <h1>Hello I'm ready for vacation</h1>
      <Outlet context={
        //{}hold alot of info
        {
          DIYs: DIYs
        }
      }/>
    </>
  )
}

export default App
