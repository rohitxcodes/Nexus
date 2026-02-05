import React from 'react'
import { Link } from 'react-router-dom'

const Play = () => {
  return (<>
    <div>Play</div>
    <Link to="/train/play/game"><p style={{ cursor: "pointer" }}>Click Me</p></Link>

  </>
  )
}

export default Play