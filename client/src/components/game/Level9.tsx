import { useEffect, useState } from "react";
import GameWrapper from "@/components/game/GameWrapper";
import { api } from "@/lib/api";

export default function Level9() {
  const [msg, setMsg] = useState("Triggering 404...");

  useEffect(() => {
    api
      .get("/games/clue/missing-resource")
      .then((res) => setMsg(res.data.message || "Check the 404 response body"))
      .catch((err) => {
        const fallback =
          err.response?.data?.error || "Not Found - inspect response";
        setMsg(fallback);
      });
  }, []);

  return (
    <GameWrapper
      gameId="level-9"
      title="Level 9: 404 Founder"
      description="Missing pages can still carry data."
      hintText="A request that finds nothing can still come back with something."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> a <code>404 Not Found</code> is{" "}
            still a real HTTP response. The status code reports
            "resource not here," but the response always has headers and
            usually a body. Many APIs send a structured JSON 404 with
            details about what was missing and what to try next.
          </p>
          <p>
            <strong>Why it matters:</strong> never throw away error
            responses. Front-end <code>fetch</code>/<code>axios</code>{" "}
            error handlers should read <code>response.data</code> /{" "}
            <code>response.body</code> on failed requests — not just{" "}
            <code>response.status</code>. That's how you surface the right
            error message to the user instead of a generic "Something
            went wrong".
          </p>
        </>
      }>
      <div className="text-center">
        <p className="font-mono text-sm bg-black text-emerald-400 p-4 rounded">
          {msg}
        </p>
        <p className="text-xs text-slate-400 mt-2">
          The flag lives in the 404 response body.
        </p>
      </div>
    </GameWrapper>
  );
}
