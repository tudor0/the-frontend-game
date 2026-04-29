import {
  useState,
  useEffect,
  useRef,
  useMemo,
  type ChangeEvent,
  type FormEvent,
  type ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { formatDuration } from "@/lib/utils";
import { LEVELS } from "@/config/levels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  HelpCircle,
  Clock,
  Trophy,
  GraduationCap,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";

interface GameWrapperProps {
  gameId: string;
  title: string;
  description: string;
  hintText: string;
  tutorial?: ReactNode;
  children: ReactNode;
  onComplete?: () => void;
}

export default function GameWrapper({
  gameId,
  title,
  description,
  hintText,
  tutorial,
  children,
  onComplete
}: GameWrapperProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "active" | "solved">(
    "loading"
  );
  const [flag, setFlag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintDialogOpen, setHintDialogOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [solvedDuration, setSolvedDuration] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  const nextLevel = useMemo(() => {
    const idx = LEVELS.findIndex((l) => l.id === gameId);
    return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
  }, [gameId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsed(0);
    };
  }, []);

  useEffect(() => {
    const initGame = async () => {
      try {
        const res = await api.post("/games/start", { gameId });
        if (res.data.status === "completed") {
          setStatus("solved");
          if (typeof res.data.durationSeconds === "number") {
            setSolvedDuration(res.data.durationSeconds);
          }
        } else {
          setStartTime(res.data.startTime);
          if (res.data.hintsUsed) setShowHint(true);
          setStatus("active");
        }
      } catch {
        toast.error("Failed to start game");
      }
    };
    initGame();
  }, [gameId]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (status === "active" && startTime) {
      timerRef.current = setInterval(() => {
        const start = new Date(startTime).getTime();
        setElapsed(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status, startTime]);

  // Keyboard shortcuts: Esc → dashboard (always), ? → toggle tutorial
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Esc is universal — works even from inside the flag input.
        // Blur first so any open IME/composition releases.
        (e.target as HTMLElement | null)?.blur?.();
        e.preventDefault();
        navigate("/");
        return;
      }

      if (e.key !== "?" || !tutorial) return;
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing) return;
      e.preventDefault();
      setTutorialOpen((open) => !open);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, tutorial]);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!flag || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.post("/games/validate", { gameId, userFlag: flag });

      if (res.data.success) {
        const duration =
          typeof res.data.duration === "number" ? res.data.duration : elapsed;
        setSolvedDuration(duration);
        toast.success(`Correct! Time: ${formatDuration(duration)}`);
        setStatus("solved");
        if (onComplete) onComplete();
      } else {
        toast.error("Incorrect flag. Try again!");
      }
    } catch {
      toast.error("Error validating flag");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseHint = async () => {
    setHintDialogOpen(false);
    try {
      await api.post("/games/hint", { gameId });
      setShowHint(true);
    } catch {
      toast.error("Could not get hint");
    }
  };

  const isSolved = status === "solved";
  const finalDuration = solvedDuration ?? elapsed;

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <Card className="shadow-lg border-2 border-slate-100">
        <CardHeader>
          <div className="flex flex-wrap justify-between items-start gap-2">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" />{" "}
                {formatDuration(isSolved ? finalDuration : elapsed)}
              </Badge>
              {isSolved && <Badge className="bg-emerald-500">SOLVED</Badge>}
            </div>
          </div>
          <p className="text-slate-500">{description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {status === "loading" ? (
            <>
              <div className="h-12 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-[200px] animate-pulse rounded-xl bg-slate-100" />
            </>
          ) : (
            <>
              {tutorial && (
                <details
                  ref={detailsRef}
                  open={tutorialOpen}
                  onToggle={(e) =>
                    setTutorialOpen((e.target as HTMLDetailsElement).open)
                  }
                  className="group rounded-lg border border-blue-100 bg-blue-50/40 open:bg-blue-50/60">
                  <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm font-medium text-blue-900">
                    <GraduationCap className="h-4 w-4" />
                    Tutorial — what this level teaches
                    <span className="ml-auto flex items-center gap-2 text-xs text-blue-700/70">
                      <kbd className="hidden rounded border border-blue-200 bg-white px-1.5 font-mono text-[10px] sm:inline">
                        ?
                      </kbd>
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </span>
                  </summary>
                  <div className="space-y-3 px-4 pb-4 text-sm leading-relaxed text-slate-700 [&_code]:rounded [&_code]:bg-slate-200 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs">
                    {tutorial}
                  </div>
                </details>
              )}

              <div className="bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-8 min-h-[200px] flex flex-col justify-center items-center relative">
                {children}
              </div>

              {!isSolved && (
                <div className="flex justify-between items-center">
                  {!showHint ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHintDialogOpen(true)}
                      className="text-slate-400 hover:text-amber-500">
                      <HelpCircle className="w-4 h-4 mr-2" /> Need a hint?
                    </Button>
                  ) : (
                    <div className="bg-amber-50 text-amber-800 p-3 rounded text-sm w-full border border-amber-100">
                      <strong>HINT:</strong> {hintText}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>

        {status !== "loading" && (
          <CardFooter className="bg-slate-50/50 p-6">
            {isSolved ? (
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <Trophy className="h-6 w-6 shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold">Mission complete</div>
                    <div className="text-sm text-emerald-800/80">
                      Solved in {formatDuration(finalDuration)}
                      {showHint ? " · hint used" : ""}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Dashboard
                  </Button>
                  {nextLevel ? (
                    <Button
                      onClick={() => navigate(`/game/${nextLevel.id}`)}
                      className="gap-2">
                      Next: {nextLevel.title} <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate("/leaderboard")}
                      className="gap-2">
                      <Trophy className="h-4 w-4" /> Leaderboard
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="gap-2 sm:order-1">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                <Input
                  placeholder="Enter flag (e.g., SECRET_CODE)"
                  value={flag}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFlag(e.target.value)
                  }
                  className="flex-1 font-mono uppercase sm:order-2"
                  autoFocus
                />
                <Button
                  type="submit"
                  disabled={submitting || !flag}
                  className="sm:order-3">
                  {submitting ? "Checking…" : "Submit flag"}
                </Button>
              </form>
            )}
          </CardFooter>
        )}
      </Card>

      <Dialog open={hintDialogOpen} onOpenChange={setHintDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Use a hint?</DialogTitle>
            <DialogDescription>
              Using a hint will be recorded on your profile and may affect your
              ranking. You can still solve the level for full credit elsewhere.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setHintDialogOpen(false)}>
              Keep trying
            </Button>
            <Button
              onClick={handleUseHint}
              className="gap-2 bg-amber-500 hover:bg-amber-600">
              <RotateCcw className="h-4 w-4" /> Show hint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
