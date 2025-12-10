import { useEffect, useState } from "react";
import GameWrapper from "@/components/game/GameWrapper";
import { api } from "@/lib/api";

export default function Level7() {
  const [errorMsg, setErrorMsg] = useState("Waiting for request...");

  useEffect(() => {
    api
      .get("/games/clue/bad-request")
      .then((res) => setErrorMsg(res.data.message || "Check the Network tab"))
      .catch((err) => {
        setErrorMsg(err.response?.data?.error || "Bad Request captured");
      });
  }, []);

  return (
    <GameWrapper
      gameId="level-7"
      title="Level 7: Bad Request"
      description="Errors can leak information."
      hintText="Open the Network tab and inspect the 400 response body.">
      <div className="text-center">
        <p className="font-mono text-sm bg-black text-amber-500 p-4 rounded">
          {errorMsg}
        </p>
        <p className="text-xs text-slate-400 mt-2">
          The flag hides inside the failing request payload.
        </p>
      </div>
    </GameWrapper>
  );
}
