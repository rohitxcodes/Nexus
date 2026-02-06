import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/App.css";
import "./styles/index.css";
import Train from "./pages/Train/Train";
import Home from "./pages/Home/Home";
import Level from "./pages/level/Level";
import Game from "./pages/Game/Game";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Landing from "./pages/Landing/DemoLandingPage";

function App() {
  const router = createBrowserRouter([
    // FIRST PAGE (public)
    { path: "/", element: <Landing /> },

    // AUTH
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },

    // PROTECTED (entry only after login)
    { path: "/home", element: <Home /> },
    { path: "/train", element: <Train /> },
    { path: "/train/play", element: <Level /> },
    { path: "/train/play/game", element: <Game /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
