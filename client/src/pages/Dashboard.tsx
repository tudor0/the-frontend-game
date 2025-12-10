import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { LEVELS } from "@/config/levels";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Trophy, Timer, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<
    "All" | "Easy" | "Medium" | "Hard"
  >("All");

  // Luăm statisticile de la backend când intrăm pe pagină
  useEffect(() => {
    api
      .get("/games/my-stats")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  // Calculăm progresul
  const solvedIds = stats.map((s) => s.gameId);
  const totalScore = stats.reduce((acc, curr) => acc + curr.value, 0);
  const difficultyOrder: Record<"Easy" | "Medium" | "Hard", number> = {
    Easy: 0,
    Medium: 1,
    Hard: 2
  };

  const filteredLevels =
    difficultyFilter === "All"
      ? LEVELS
      : LEVELS.filter((lvl) => lvl.difficulty === difficultyFilter);

  const orderedLevels = [...filteredLevels].sort(
    (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {user?.name}
          </h1>
          <p className="text-slate-500">Ready to hack the web?</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate("/leaderboard")}
            className="gap-2">
            <Trophy className="w-4 h-4" /> Leaderboard
          </Button>
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Solved
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.length} / {LEVELS.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Score
            </CardTitle>
            <Trophy className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScore} pts</div>
          </CardContent>
        </Card>
        <Card>
          {/* Poți adăuga average time aici dacă vrei */}
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Rank
            </CardTitle>
            <Badge variant="secondary">Junior Dev</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-400 mt-2">
              Finish all levels to become Senior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS + LEVELS GRID */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h2 className="text-xl font-bold text-slate-800">
            Available Missions
          </h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {(["All", "Easy", "Medium", "Hard"] as const).map((difficulty) => (
              <Button
                key={difficulty}
                variant={
                  difficultyFilter === difficulty ? "default" : "outline"
                }
                size="sm"
                onClick={() => setDifficultyFilter(difficulty)}>
                {difficulty}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orderedLevels.map((level) => {
            const isSolved = solvedIds.includes(level.id);
            const levelStat = stats.find((s) => s.gameId === level.id);

            return (
              <Card
                key={level.id}
                className={`hover:shadow-lg transition-all cursor-pointer border-2 ${
                  isSolved
                    ? "border-emerald-100 bg-emerald-50/30"
                    : "border-transparent"
                }`}
                onClick={() => navigate(`/game/${level.id}`)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge
                      variant={
                        level.difficulty === "Easy"
                          ? "secondary"
                          : level.difficulty === "Medium"
                          ? "default"
                          : "destructive"
                      }>
                      {level.difficulty}
                    </Badge>
                    {isSolved && (
                      <Badge className="bg-emerald-500">
                        <CheckCircle className="w-3 h-3 mr-1" /> Done
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-2">{level.title}</CardTitle>
                  <CardDescription>{level.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isSolved ? (
                    <div className="text-sm text-emerald-700 flex items-center gap-2">
                      <Timer className="w-4 h-4" /> Solved in{" "}
                      {levelStat.durationSeconds}s
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400">
                      Click to start mission
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
