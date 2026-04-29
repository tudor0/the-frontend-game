import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import GameWrapper from "@/components/game/GameWrapper";
import { api } from "@/lib/api";

export default function Level8() {
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(true);
  const [waited, setWaited] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setWaited((s) => s + 1), 1000);
    api
      .get("/games/clue/slow")
      .then((res) => setMsg(res.data.flag || "Response received"))
      .catch(() => setMsg("Request failed — try again"))
      .finally(() => {
        setPending(false);
        clearInterval(interval);
      });
    return () => clearInterval(interval);
  }, []);

  return (
    <GameWrapper
      gameId="level-8"
      title="Level 8: The Long Wait"
      description="Patience is a virtue."
      hintText="This level only fails if you give up too early."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> HTTP requests are asynchronous and
            take real time — sometimes milliseconds, sometimes seconds.
            The browser tracks each request's lifecycle in the{" "}
            <code>Network</code> tab: <em>queued</em> →{" "}
            <em>connecting</em> → <em>waiting (TTFB)</em> →{" "}
            <em>downloading</em> → <em>complete</em>. A long-running
            request will sit in <em>pending</em> until the server replies.
          </p>
          <p>
            <strong>Why it matters:</strong> understanding latency, TTFB
            (time to first byte), and where time is spent in a request
            helps you diagnose slow pages, hung connections, retries, and
            polling. The Network tab's <code>Timing</code> sub-tab is your
            performance microscope.
          </p>
        </>
      }>
      <div className="text-center w-full">
        <div className="font-mono text-sm bg-slate-900 text-emerald-400 p-4 rounded flex items-center justify-center gap-2 min-h-[3.5rem]">
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                Waiting for server… ({waited}s)
              </span>
            </>
          ) : (
            <span>{msg}</span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Don&apos;t refresh; give the request a few seconds.
        </p>
      </div>
    </GameWrapper>
  );
}
