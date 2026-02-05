import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "./index.css"
import { FaArrowCircleRight } from "react-icons/fa";
import Body from './components/Body'
import Nav from "./components/Nav"
import Train from './components/Train'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './components/Home'
import Play from './components/Play'
import Game from './components/Game'
import Register from './components/Register'
import Login from './components/Login'


function App() {
  const [count, setCount] = useState(0)
  const router = createBrowserRouter([

    {
      path: "/train",
      element: <Train />
    },
    {
      path:"/train/play/game",
      element:<Game/>
    },
    {
      path: "/",
      element: <Home/>
    },
    {
      path:"/train/play",
      element:<Play/>
    },
    {
      path: "/register",
      element: <Register/>
    },
    {
      path: "/login",
      element: <Login/>
    }
  ])

  return (<>

    <RouterProvider router={router} />
  </>
  )
}
export default App;
""