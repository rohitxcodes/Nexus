import { createBrowserRouter, Navigate } from "react-router-dom";

import Train from "../pages/Train/Train";
import Home from "../pages/Home/Home";
import Level from "../pages/level/Level";
import Game from "../pages/Game/Game";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Landing from "../pages/Landing/DemoLandingPage";
import ProblemPage from "../features/problem_solving/pages/ProblemPage";
import Shop from "../pages/Shop/Shop";
import PublicRoute from "../components/common/PublicRoute";

import ProtectedRoute from "../components/common/ProtectedRoute";

const router = createBrowserRouter([
  // PUBLIC ROUTES
  { path: "/", element: <Landing /> },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },

  // PROTECTED ROUTES
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/train",
    element: (
      <ProtectedRoute>
        <Train />
      </ProtectedRoute>
    ),
  },
  {
    path: "/train/play",
    element: (
      <ProtectedRoute>
        <Level />
      </ProtectedRoute>
    ),
  },
  {
    path: "/train/play/game",
    element: (
      <ProtectedRoute>
        <Game />
      </ProtectedRoute>
    ),
  },
  {
    path: "/levels/:levelNumber",
    element: (
      <ProtectedRoute>
        <ProblemPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/shop",
    element: (
      <ProtectedRoute>
        <Shop />
      </ProtectedRoute>
    ),
  },

  // fallback
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;
