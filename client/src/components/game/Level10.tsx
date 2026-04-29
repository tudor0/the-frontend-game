import { useEffect, useState } from "react";
import GameWrapper from "@/components/game/GameWrapper";
import { api } from "@/lib/api";

export default function Level10() {
  const [msg, setMsg] = useState("Inspect the request URL...");

  useEffect(() => {
    api
      .get("/games/clue/params?flag=PARAMS_DETECTIVE")
      .then((res) => setMsg(res.data.message || "Params sent."))
      .catch(() => setMsg("Request sent. Check the query params."));
  }, []);

  return (
    <GameWrapper
      gameId="level-10"
      title="Level 10: URL Detective"
      description="Watch what you send in the URL."
      hintText="Open Network → check the request URL/query params."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> a URL has structured parts —{" "}
            <code>protocol://host/path?query#hash</code>. The{" "}
            <em>query string</em> (everything after the <code>?</code>) is
            a list of <code>key=value</code> pairs separated by{" "}
            <code>&amp;</code>. It's part of the request line itself, so
            it shows up in browser history, server logs, proxy logs, and
            anywhere else a URL is recorded.
          </p>
          <p>
            <strong>Why it matters:</strong> putting sensitive data in
            URLs is a classic mistake. Tokens, passwords, PII, and
            internal IDs in query strings end up in nginx access logs,
            CDN logs, the user's history, and any third-party JS that
            reads <code>document.referrer</code>. Auth tokens belong in{" "}
            <code>Authorization</code> headers or cookies — never in the
            URL.
          </p>
        </>
      }>
      <div className="text-center space-y-2">
        <p className="font-mono text-sm bg-slate-900 text-amber-400 p-4 rounded">
          {msg}
        </p>
        <p className="text-xs text-slate-400">
          The query string holds your answer.
        </p>
      </div>
    </GameWrapper>
  );
}
