import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";

import PublicRoute from "../components/common/PublicRoute";
import ProtectedRoute from "../components/common/ProtectedRoute";

const LeaderBord = lazy(() => import("../pages/Train/LeaderBord"));
const Home = lazy(() => import("../pages/Home/Home"));
const Level = lazy(() => import("../pages/level/Level"));
const Game = lazy(() => import("../pages/Game/Game"));
const Register = lazy(() => import("../pages/auth/Register"));
const Login = lazy(() => import("../pages/auth/Login"));
const Landing = lazy(() => import("../pages/Landing/DemoLandingPage"));
const ProblemPage = lazy(
  () => import("../features/problem_solving/pages/ProblemPage"),
);
const Shop = lazy(() => import("../pages/Shop/Shop"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Clan = lazy(() => import("../pages/Clan/Clan"));
const OneVsOne = lazy(() => import("../pages/Game/OneVsOne"));
const AboutUs = lazy(() => import("../pages/AboutUs/Aboutus"));

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
