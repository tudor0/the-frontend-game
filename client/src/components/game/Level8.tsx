import { useEffect, useState } from "react";
import GameWrapper from "@/components/game/GameWrapper";
import { api } from "@/lib/api";

export default function Level8() {
  const [msg, setMsg] = useState("Sending slow request...");

  useEffect(() => {
    api
      .get("/games/clue/slow")
      .then((res) => setMsg(res.data.flag || "Response received"))
      .catch(() => setMsg("Request failed, try again"));
  }, []);

  return (
    <GameWrapper
      gameId="level-8"
      title="Level 8: The Long Wait"
      description="Patience is a virtue."
      hintText="Trigger the request and wait for the response body.">
      <div className="text-center">
        <p className="font-mono text-sm bg-slate-900 text-emerald-400 p-4 rounded">
          {msg}
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Don&apos;t refresh; give the request a few seconds.
        </p>
      </div>
    </GameWrapper>
  );
}
