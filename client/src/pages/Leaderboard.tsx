import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatDuration } from "@/lib/utils";
import { LEVELS } from "@/config/levels";

type LeaderboardEntry = {
  userId: string;
  name: string;
  avatarUrl: string | null;
  totalScore: number;
  solved: number;
  avgDurationSeconds: number | null;
  totalHintsUsed: number;
  totalWrongAttempts: number;
};

type LevelEntry = {
  userId: string;
  name: string;
  avatarUrl: string | null;
  durationSeconds: number;
  value: number;
  hintsUsed: boolean;
  wrongAttempts: number;
  createdAt: string;
};

const pluralize = (n: number, word: string) =>
  `${n} ${word}${n === 1 ? "" : "s"}`;

function PlayerAvatar({ entry }: { entry: { name: string; avatarUrl: string | null } }) {
  return (
    <Avatar>
      {entry.avatarUrl ? (
        <img
          src={entry.avatarUrl}
          alt={entry.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{entry.name.charAt(0).toUpperCase()}</span>
      )}
    </Avatar>
  );
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [levelEntries, setLevelEntries] = useState<LevelEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("level-1");
  const [loadingOverall, setLoadingOverall] = useState(true);
  const [loadingLevel, setLoadingLevel] = useState(true);

  useEffect(() => {
    setLoadingOverall(true);
    api
      .get<LeaderboardEntry[]>("/games/leaderboard")
      .then((res) => setEntries(res.data))
      .catch(() => setEntries([]))
      .finally(() => setLoadingOverall(false));
  }, []);

  useEffect(() => {
    setLoadingLevel(true);
    api
      .get<LevelEntry[]>(`/games/leaderboard/level/${selectedLevel}`)
      .then((res) => setLevelEntries(res.data))
      .catch(() => setLevelEntries([]))
      .finally(() => setLoadingLevel(false));
  }, [selectedLevel]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto flex flex-wrap gap-3 justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Top Players
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Best total scores, hint usage, and fastest clears.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {loadingOverall && (
          <Card>
            <CardContent className="p-6 text-center text-slate-500 dark:text-slate-400">
              Loading leaderboard…
            </CardContent>
          </Card>
        )}
        {!loadingOverall && entries.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-slate-500 dark:text-slate-400">
              No scores yet. Be the first to complete a mission!
            </CardContent>
          </Card>
        )}

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Overall Score (Top 10)
          </h2>
          {!loadingOverall &&
            entries.map((entry, idx) => (
              <Card key={entry.userId} className="border-slate-200 dark:border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-500 w-6">{idx + 1}.</div>
                    <PlayerAvatar entry={entry} />
                    <CardTitle className="text-lg">{entry.name}</CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-50">
                      {entry.totalScore} pts
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Solved {pluralize(entry.solved, "level")}
                      {entry.avgDurationSeconds
                        ? ` · Avg ${formatDuration(
                            Math.round(entry.avgDurationSeconds)
                          )}`
                        : ""}
                      {` · ${pluralize(entry.totalHintsUsed, "hint")} · ${pluralize(entry.totalWrongAttempts, "wrong attempt")}`}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Most Hints Used
          </h2>
          {loadingOverall && (
            <Card>
              <CardContent className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                Loading…
              </CardContent>
            </Card>
          )}
          {!loadingOverall &&
            entries
              .slice()
              .sort((a, b) => b.totalHintsUsed - a.totalHintsUsed)
              .filter((e) => e.totalHintsUsed > 0)
              .map((entry, idx) => (
                <Card key={entry.userId} className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-slate-500 w-6">
                        {idx + 1}.
                      </div>
                      <PlayerAvatar entry={entry} />
                      <CardTitle className="text-lg">{entry.name}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-slate-900 dark:text-slate-50">
                        {pluralize(entry.totalHintsUsed, "hint")}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Solved {entry.solved} · Score {entry.totalScore}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          {!loadingOverall && entries.every((e) => e.totalHintsUsed === 0) && (
            <Card>
              <CardContent className="p-4 text-slate-500 text-sm">
                No hints have been used yet.
              </CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Fastest Solvers (by average)
          </h2>
          {loadingOverall && (
            <Card>
              <CardContent className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                Loading…
              </CardContent>
            </Card>
          )}
          {!loadingOverall &&
            entries
              .slice()
              .filter((e) => e.avgDurationSeconds !== null)
              .sort(
                (a, b) =>
                  (a.avgDurationSeconds ?? Infinity) -
                  (b.avgDurationSeconds ?? Infinity)
              )
              .map((entry, idx) => (
                <Card key={entry.userId} className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-slate-500 w-6">
                        {idx + 1}.
                      </div>
                      <PlayerAvatar entry={entry} />
                      <CardTitle className="text-lg">{entry.name}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-slate-900 dark:text-slate-50">
                        {formatDuration(
                          Math.round(entry.avgDurationSeconds ?? 0)
                        )}{" "}
                        avg
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Solved {entry.solved} · Score {entry.totalScore}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          {!loadingOverall &&
            entries.every((e) => e.avgDurationSeconds === null) && (
              <Card>
                <CardContent className="p-4 text-slate-500 text-sm">
                  No durations recorded yet.
                </CardContent>
              </Card>
            )}
        </section>

        <section className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Per-Level Fastest
            </h2>
            <select
              className="border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-900 dark:text-slate-100"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}>
              {LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.title}
                </option>
              ))}
            </select>
          </div>
          {loadingLevel && (
            <Card>
              <CardContent className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                Loading…
              </CardContent>
            </Card>
          )}
          {!loadingLevel && levelEntries.length === 0 && (
            <Card>
              <CardContent className="p-4 text-slate-500 text-sm">
                No runs for this level yet.
              </CardContent>
            </Card>
          )}
          {!loadingLevel &&
            levelEntries.map((entry, idx) => (
              <Card key={`${entry.userId}-${idx}`} className="border-slate-200 dark:border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-500 w-6">{idx + 1}.</div>
                    <PlayerAvatar entry={entry} />
                    <CardTitle className="text-lg">{entry.name}</CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-50">
                      {formatDuration(entry.durationSeconds)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {entry.hintsUsed ? "Hint used" : "No hints"} ·{" "}
                      {pluralize(entry.wrongAttempts, "wrong attempt")}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
        </section>
      </div>
    </div>
  );
}
