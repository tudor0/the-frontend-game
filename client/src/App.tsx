import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";

import type { JSX } from "react";
import Level1 from "./components/game/Level1";
import Level2 from "./components/game/Level2";
import Level3 from "./components/game/Level3";
import Level4 from "./components/game/Level4";
import Level5 from "./components/game/Level5";
import Level6 from "./components/game/Level6";
import Level7 from "./components/game/Level7";
import Level8 from "./components/game/Level8";
import Level9 from "./components/game/Level9";
import Level10 from "./components/game/Level10";
import Level11 from "./components/game/Level11";
import Level12 from "./components/game/Level12";
import Level13 from "./components/game/Level13";
import Level14 from "./components/game/Level14";
import Level15 from "./components/game/Level15";

const GAME_COMPONENTS: Record<string, JSX.Element> = {
  "level-1": <Level1 />,
  "level-2": <Level2 />,
  "level-3": <Level3 />,
  "level-4": <Level4 />,
  "level-5": <Level5 />,
  "level-6": <Level6 />,
  "level-7": <Level7 />,
  "level-8": <Level8 />,
  "level-9": <Level9 />,
  "level-10": <Level10 />,
  "level-11": <Level11 />,
  "level-12": <Level12 />,
  "level-13": <Level13 />,
  "level-14": <Level14 />,
  "level-15": <Level15 />
};

const GameRoute = () => {
  const { gameId } = useParams();
  const component = gameId ? GAME_COMPONENTS[gameId] : null;
  if (!component)
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Level not found</h1>
        <p>Invalid game id: {gameId}</p>
      </div>
    );
  return component;
};

// Protectia rutelor
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rute Protejate */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        {/* Dynamic game route */}
        <Route
          path="/game/:gameId"
          element={
            <ProtectedRoute>
              <GameRoute />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
