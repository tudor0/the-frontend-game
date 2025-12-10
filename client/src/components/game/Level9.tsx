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
      hintText="Open the Network tab and inspect the 404 JSON response.">
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
