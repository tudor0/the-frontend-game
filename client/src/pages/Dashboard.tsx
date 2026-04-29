import { useEffect, useMemo, useState } from "react";
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
import {
  LogOut,
  Trophy,
  Timer,
  CheckCircle,
  ArrowRight,
  PartyPopper,
  GraduationCap
} from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

type LevelStat = {
  gameId: string;
  value: number;
  durationSeconds: number;
  hintsUsed: boolean;
  wrongAttempts: number;
};

const RANKS = [
  { min: 0, label: "Newcomer", next: 1 },
  { min: 1, label: "Junior Dev", next: 5 },
  { min: 5, label: "Mid Dev", next: 10 },
  { min: 10, label: "Senior Dev", next: 15 },
  { min: 15, label: "Hacker", next: null }
] as const;

const rankFor = (solved: number) =>
  RANKS.slice()
    .reverse()
    .find((r) => solved >= r.min) ?? RANKS[0];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<LevelStat[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<
    "All" | "Easy" | "Medium" | "Hard"
  >("All");

  useEffect(() => {
    setLoadingStats(true);
    api
      .get<LevelStat[]>("/games/my-stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats([]))
      .finally(() => setLoadingStats(false));
  }, []);

  const solvedIds = useMemo(() => stats.map((s) => s.gameId), [stats]);
  const totalScore = stats.reduce((acc, curr) => acc + curr.value, 0);
  const solvedCount = stats.length;
  const totalLevels = LEVELS.length;
  const progressPct = Math.round((solvedCount / totalLevels) * 100);
  const rank = rankFor(solvedCount);
  const allDone = solvedCount === totalLevels;
  const nextLevel = LEVELS.find((l) => !solvedIds.includes(l.id));

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
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto flex flex-wrap justify-between items-start gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Welcome, {user?.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Ready to hack the web?
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            onClick={() => navigate("/tutorial")}
            className="gap-2">
            <GraduationCap className="w-4 h-4" /> Tutorial
          </Button>
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

      {/* COMPLETION BANNER */}
      {!loadingStats && allDone && (
        <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100">
          <PartyPopper className="h-6 w-6 shrink-0" />
          <div className="flex-1">
            <div className="font-semibold">
              You finished The Frontend Game!
            </div>
            <div className="text-sm text-emerald-800/80 dark:text-emerald-200/80">
              All 15 missions solved · {totalScore} pts · Rank: {rank.label}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/leaderboard")}
            className="gap-2">
            <Trophy className="h-4 w-4" /> See leaderboard
          </Button>
        </div>
      )}

      {/* TUTORIAL BANNER (first-time users) */}
      {!loadingStats && solvedCount === 0 && (
        <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/40 dark:bg-blue-900/20">
          <GraduationCap className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" />
          <div className="flex-1">
            <div className="font-semibold text-blue-900 dark:text-blue-100">
              New here? Take the 2-minute tutorial.
            </div>
            <div className="text-sm text-blue-800/70 dark:text-blue-200/70">
              Learn what flags are, how DevTools works, and try a practice
              round.
            </div>
          </div>
          <Button onClick={() => navigate("/tutorial")} className="gap-2">
            Start tutorial <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* CONTINUE BANNER */}
      {!loadingStats && !allDone && solvedCount > 0 && nextLevel && (
        <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/40 dark:bg-blue-900/20">
          <Timer className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" />
          <div className="flex-1">
            <div className="text-sm text-blue-900/70 dark:text-blue-100/70">
              Pick up where you left off
            </div>
            <div className="font-semibold text-blue-900 dark:text-blue-100">
              {nextLevel.title}{" "}
              <span className="text-sm font-normal text-blue-800/70 dark:text-blue-200/70">
                · {nextLevel.difficulty}
              </span>
            </div>
          </div>
          <Button
            onClick={() => navigate(`/game/${nextLevel.id}`)}
            className="gap-2">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

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
              {loadingStats ? "…" : `${solvedCount} / ${totalLevels}`}
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {loadingStats ? "" : `${progressPct}% complete`}
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
            <div className="text-2xl font-bold">
              {loadingStats ? "…" : `${totalScore} pts`}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {totalLevels * 100} pts available
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Rank
            </CardTitle>
            <Badge variant="secondary">{rank.label}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-400">
              {rank.next === null
                ? "You're at the top — nothing left to prove."
                : `Solve ${rank.next - solvedCount} more to level up.`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS + LEVELS GRID */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
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
                    ? "border-emerald-100 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-900/10"
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
                  {loadingStats ? (
                    <div className="text-sm text-slate-400">
                      Loading stats…
                    </div>
                  ) : isSolved && levelStat ? (
                    <div className="text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                      <Timer className="w-4 h-4" /> Solved in{" "}
                      {formatDuration(levelStat.durationSeconds)}
                      {levelStat.hintsUsed ? " · hint used" : ""}
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
