import { createBrowserRouter, Navigate } from "react-router-dom";

import LeaderBord from "../pages/Train/LeaderBord";
import Home from "../pages/Home/Home";
import Level from "../pages/level/Level";
import Game from "../pages/Game/Game";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Landing from "../pages/Landing/DemoLandingPage";
import ProblemPage from "../features/problem_solving/pages/ProblemPage";
import Shop from "../pages/Shop/Shop";
import Profile from "../pages/Profile/Profile";
import PublicRoute from "../components/common/PublicRoute";
import Clan from "../pages/Clan/Clan";
import OneVsOne from "../pages/Game/OneVsOne";
import AboutUs from "../pages/AboutUs/Aboutus";
import ProtectedRoute from "../components/common/ProtectedRoute";

const router = createBrowserRouter([
  // PUBLIC ROUTES
  { path: "/", element: <Landing /> },
  {
    path: "/aboutUs",
    element: <AboutUs />,
  },
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
    path: "/leaderbord",
    element: (
      <ProtectedRoute>
        <LeaderBord />
      </ProtectedRoute>
    ),
  },
  {
    path: "/play",
    element: (
      <ProtectedRoute>
        <Level />
      </ProtectedRoute>
    ),
  },
  {
    path: "/play/game",
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
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/clan",
    element: (
      <ProtectedRoute>
        <Clan />
      </ProtectedRoute>
    ),
  },
  {
    path: "/1v1",
    element: (
      <ProtectedRoute>
        <OneVsOne />
      </ProtectedRoute>
    ),
  },

  // fallback
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;
