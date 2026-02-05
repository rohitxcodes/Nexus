import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/App.css";
import "./styles/index.css";
import Train from "./pages/Train/Train";
import Home from "./pages/Home/Home";
import Play from "./pages/Play/Play";
import Game from "./pages/Game/Game";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/train", element: <Train /> },
    { path: "/train/play", element: <Play /> },
    { path: "/train/play/game", element: <Game /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
