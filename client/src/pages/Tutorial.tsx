import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Inspect,
  Trophy,
  Keyboard
} from "lucide-react";
import { toast } from "sonner";

const TUTORIAL_FLAG = "READY_TO_PLAY";
const STEPS = ["welcome", "devtools", "practice", "submit", "done"] as const;
type Step = (typeof STEPS)[number];

export default function Tutorial() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [flag, setFlag] = useState("");

  const idx = STEPS.indexOf(step);
  const progressPct = Math.round((idx / (STEPS.length - 1)) * 100);

  // Esc → dashboard, ←/→ → previous/next step (mirrors level shortcuts)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        (e.target as HTMLElement | null)?.blur?.();
        e.preventDefault();
        navigate("/");
        return;
      }
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing) return;
      if (e.key === "ArrowRight") {
        const next = STEPS[STEPS.indexOf(step) + 1];
        if (next) setStep(next);
      } else if (e.key === "ArrowLeft") {
        const prev = STEPS[STEPS.indexOf(step) - 1];
        if (prev) setStep(prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, step]);

  const goNext = () => {
    const next = STEPS[idx + 1];
    if (next) setStep(next);
  };
  const goBack = () => {
    const prev = STEPS[idx - 1];
    if (prev) setStep(prev);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = flag.trim().toUpperCase();
    if (cleaned === TUTORIAL_FLAG) {
      toast.success("Nice — you've got the basics. Welcome aboard!");
      setStep("done");
    } else {
      toast.error("Not quite. Open DevTools and inspect the puzzle area.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>

        <Card className="shadow-lg border-2 border-slate-100">
          <CardHeader>
            <div className="flex flex-wrap justify-between items-start gap-2">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <GraduationCap className="h-6 w-6" />
                Tutorial
              </CardTitle>
              <Badge variant="outline">
                Step {idx + 1} of {STEPS.length}
              </Badge>
            </div>
            <p className="text-slate-500">
              A 2-minute walkthrough of how the game works.
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-5 text-sm leading-relaxed text-slate-700 dark:text-slate-200 [&_code]:rounded [&_code]:bg-slate-200 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs dark:[&_code]:bg-slate-800">
            {step === "welcome" && (
              <>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  What's this game about?
                </h3>
                <p>
                  Each level hides a <strong>flag</strong> — a string like{" "}
                  <code>SECRET_CODE</code> — somewhere on the page, in the
                  network, or in the browser's storage. Your job is to find it
                  and submit it.
                </p>
                <p>
                  Flags are never in the visible body of the page; you'll need
                  the browser's DevTools to find them. By the time you finish
                  all 15 missions you'll be fluent in the Elements panel,
                  Network panel, Console, Application storage, and a few
                  encoding tricks.
                </p>
                <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-900/20">
                  <strong>What you score on:</strong> time to solve, hints
                  used, and wrong attempts. Faster solves and fewer hints =
                  higher leaderboard rank.
                </div>
              </>
            )}

            {step === "devtools" && (
              <>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Meet your tools: DevTools
                </h3>
                <p>
                  Every modern browser ships a built-in panel called DevTools.
                  Open it any of these ways:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    Right-click anywhere on the page → <code>Inspect</code>
                  </li>
                  <li>
                    macOS:{" "}
                    <kbd className="rounded border bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
                      Cmd
                    </kbd>{" "}
                    +{" "}
                    <kbd className="rounded border bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
                      Opt
                    </kbd>{" "}
                    +{" "}
                    <kbd className="rounded border bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
                      I
                    </kbd>
                  </li>
                  <li>
                    Windows / Linux:{" "}
                    <kbd className="rounded border bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
                      F12
                    </kbd>{" "}
                    or{" "}
                    <kbd className="rounded border bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
                      Ctrl
                    </kbd>{" "}
                    +{" "}
                    <kbd className="rounded border bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
                      Shift
                    </kbd>{" "}
                    +{" "}
                    <kbd className="rounded border bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
                      I
                    </kbd>
                  </li>
                </ul>
                <p>The panels you'll use most:</p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    <strong>Elements</strong> — the live HTML/CSS of the page
                  </li>
                  <li>
                    <strong>Console</strong> — JavaScript REPL + log output
                  </li>
                  <li>
                    <strong>Network</strong> — every request the page makes
                  </li>
                  <li>
                    <strong>Application</strong> — cookies,{" "}
                    <code>localStorage</code>, <code>sessionStorage</code>,
                    cache
                  </li>
                </ul>
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-100">
                  <Inspect className="h-4 w-4 shrink-0" />
                  <span>
                    Open DevTools <em>now</em> — keep it open for the next
                    step.
                  </span>
                </div>
              </>
            )}

            {step === "practice" && (
              <>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Practice round
                </h3>
                <p>
                  Below is a puzzle box. Somewhere inside it there's a flag,
                  but the page is rendering it in white text on a white
                  background — invisible to your eye, plain as day to
                  DevTools.
                </p>
                <p>
                  Open the <code>Elements</code> panel, click the
                  arrow-in-a-box icon (top-left of DevTools), then hover the
                  empty area in the puzzle box. Read the text content of the
                  hovered node.
                </p>
                <div className="relative bg-slate-50 border rounded-xl p-8 min-h-[180px] flex flex-col justify-center items-center dark:bg-slate-900 dark:border-slate-700">
                  <h4 className="text-lg font-medium mb-3">
                    The flag is right here.
                  </h4>
                  {/* The flag text matches the puzzle background exactly in
                      both light and dark, so it's invisible to the eye but
                      fully present in the DOM. */}
                  <p className="text-slate-50 select-text dark:text-slate-900">
                    Flag: {TUTORIAL_FLAG}
                  </p>
                </div>
              </>
            )}

            {step === "submit" && (
              <>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Submit the flag
                </h3>
                <p>
                  Type the flag you found in the box below and press{" "}
                  <kbd className="rounded border bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
                    Enter
                  </kbd>
                  . Flags are case-insensitive and are submitted via the
                  footer of every level.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    placeholder="Enter the flag you found"
                    value={flag}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFlag(e.target.value)
                    }
                    className="font-mono uppercase"
                    autoFocus
                  />
                  <Button type="submit" className="w-full gap-2">
                    Check flag
                  </Button>
                </form>
                <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  <Keyboard className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <div>
                      <strong className="text-slate-700 dark:text-slate-200">
                        On this tutorial:
                      </strong>{" "}
                      <kbd className="rounded border bg-white px-1.5 py-0.5 font-mono dark:border-slate-700 dark:bg-slate-800">
                        ←
                      </kbd>{" "}
                      /{" "}
                      <kbd className="rounded border bg-white px-1.5 py-0.5 font-mono dark:border-slate-700 dark:bg-slate-800">
                        →
                      </kbd>{" "}
                      switch steps,{" "}
                      <kbd className="rounded border bg-white px-1.5 py-0.5 font-mono dark:border-slate-700 dark:bg-slate-800">
                        Esc
                      </kbd>{" "}
                      goes to the dashboard.
                    </div>
                    <div>
                      <strong className="text-slate-700 dark:text-slate-200">
                        Inside a level:
                      </strong>{" "}
                      <kbd className="rounded border bg-white px-1.5 py-0.5 font-mono dark:border-slate-700 dark:bg-slate-800">
                        Esc
                      </kbd>{" "}
                      → dashboard,{" "}
                      <kbd className="rounded border bg-white px-1.5 py-0.5 font-mono dark:border-slate-700 dark:bg-slate-800">
                        ?
                      </kbd>{" "}
                      toggles the tutorial section.
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === "done" && (
              <>
                <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100">
                  <Trophy className="h-6 w-6 shrink-0" />
                  <div>
                    <div className="font-semibold">You're ready</div>
                    <div className="text-sm text-emerald-800/80 dark:text-emerald-200/80">
                      That's the entire loop: find a flag, submit it, watch
                      the timer.
                    </div>
                  </div>
                </div>
                <p>
                  The 15 real missions get progressively trickier — they cover
                  HTML, CSS, attributes, response headers, error bodies, slow
                  requests, query strings, cookies, storage, console logs, and
                  base64 decoding.
                </p>
                <p className="text-slate-500">
                  Stuck on any level? Each one has a built-in tutorial section
                  (the blue box) and a hint button.
                </p>
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t bg-slate-50/50 p-6 dark:bg-slate-900/40">
            {step === "done" ? (
              <>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Back to dashboard
                </Button>
                <Button
                  onClick={() => navigate("/game/level-1")}
                  className="gap-2">
                  Start mission 1 <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={goBack}
                  disabled={idx === 0}
                  className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                {step === "submit" ? (
                  <Button variant="ghost" onClick={() => setStep("done")}>
                    Skip
                  </Button>
                ) : (
                  <Button onClick={goNext} className="gap-2">
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
