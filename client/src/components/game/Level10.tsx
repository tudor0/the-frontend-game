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
      hintText="Open Network → check the request URL/query params.">
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
