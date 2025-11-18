import React, { useEffect } from 'react'
import "./style/index.css"
import Header from './components/header.jsx'
import MainMenu from './components/main-menu.jsx'

function App() {
  return (
    <>
      <div className='container'>
        <MainMenu />
        <Header />
      </div>
    </>
  )
}

export default App