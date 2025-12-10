import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type LeaderboardEntry = {
  userId: string;
  name: string;
  email: string;
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
  email: string;
  avatarUrl: string | null;
  durationSeconds: number;
  value: number;
  hintsUsed: boolean;
  wrongAttempts: number;
  createdAt: string;
};

export default function Leaderboard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [levelEntries, setLevelEntries] = useState<LevelEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("level-1");

  useEffect(() => {
    api
      .get<LeaderboardEntry[]>("/games/leaderboard")
      .then((res) => setEntries(res.data))
      .catch(() => setEntries([]));
  }, []);

  useEffect(() => {
    api
      .get<LevelEntry[]>(`/games/leaderboard/level/${selectedLevel}`)
      .then((res) => setLevelEntries(res.data))
      .catch(() => setLevelEntries([]));
  }, [selectedLevel]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Top Players</h1>
          <p className="text-slate-500">
            Best total scores, hint usage, and fastest clears.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {entries.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-slate-500">
              No scores yet. Be the first to complete a mission!
            </CardContent>
          </Card>
        )}

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800">
            Overall Score (Top 10)
          </h2>
          {entries.map((entry, idx) => (
            <Card key={entry.userId} className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-500 w-6">{idx + 1}.</div>
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
                  <div>
                    <CardTitle className="text-lg">{entry.name}</CardTitle>
                    <p className="text-xs text-slate-500">{entry.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-900">
                    {entry.totalScore} pts
                  </div>
                  <div className="text-xs text-slate-500">
                    Solved {entry.solved} levels
                    {entry.avgDurationSeconds
                      ? ` • Avg ${Math.round(entry.avgDurationSeconds)}s`
                      : ""}
                    {` • Hints ${entry.totalHintsUsed} • Wrong ${entry.totalWrongAttempts}`}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800">
            Most Hints Used
          </h2>
          {entries
            .slice()
            .sort((a, b) => b.totalHintsUsed - a.totalHintsUsed)
            .filter((e) => e.totalHintsUsed > 0)
            .map((entry, idx) => (
              <Card key={entry.userId} className="border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-500 w-6">{idx + 1}.</div>
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
                    <div>
                      <CardTitle className="text-lg">{entry.name}</CardTitle>
                      <p className="text-xs text-slate-500">{entry.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900">
                      {entry.totalHintsUsed} hints
                    </div>
                    <div className="text-xs text-slate-500">
                      Solved {entry.solved} • Score {entry.totalScore}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          {entries.every((e) => e.totalHintsUsed === 0) && (
            <Card>
              <CardContent className="p-4 text-slate-500 text-sm">
                No hints have been used yet.
              </CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800">
            Fastest Solvers (by average)
          </h2>
          {entries
            .slice()
            .filter((e) => e.avgDurationSeconds !== null)
            .sort(
              (a, b) =>
                (a.avgDurationSeconds ?? Infinity) -
                (b.avgDurationSeconds ?? Infinity)
            )
            .map((entry, idx) => (
              <Card key={entry.userId} className="border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-500 w-6">{idx + 1}.</div>
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
                    <div>
                      <CardTitle className="text-lg">{entry.name}</CardTitle>
                      <p className="text-xs text-slate-500">{entry.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900">
                      {Math.round(entry.avgDurationSeconds ?? 0)}s avg
                    </div>
                    <div className="text-xs text-slate-500">
                      Solved {entry.solved} • Score {entry.totalScore}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          {entries.every((e) => e.avgDurationSeconds === null) && (
            <Card>
              <CardContent className="p-4 text-slate-500 text-sm">
                No durations recorded yet.
              </CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-800">
              Per-Level Fastest
            </h2>
            <select
              className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}>
              {[
                "level-1",
                "level-2",
                "level-3",
                "level-4",
                "level-5",
                "level-6",
                "level-7",
                "level-8",
                "level-9",
                "level-10",
                "level-11",
                "level-12",
                "level-13",
                "level-14",
                "level-15"
              ].map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>
          {levelEntries.length === 0 && (
            <Card>
              <CardContent className="p-4 text-slate-500 text-sm">
                No runs for this level yet.
              </CardContent>
            </Card>
          )}
          {levelEntries.map((entry, idx) => (
            <Card key={`${entry.userId}-${idx}`} className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-500 w-6">{idx + 1}.</div>
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
                  <div>
                    <CardTitle className="text-lg">{entry.name}</CardTitle>
                    <p className="text-xs text-slate-500">{entry.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-900">
                    {entry.durationSeconds}s
                  </div>
                  <div className="text-xs text-slate-500">
                    Hints {entry.hintsUsed ? "Yes" : "No"} • Wrong{" "}
                    {entry.wrongAttempts}
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
