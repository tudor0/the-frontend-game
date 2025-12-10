import { useEffect, useState } from "react";
import GameWrapper from "@/components/game/GameWrapper";
import { api } from "@/lib/api";

export default function Level6() {
  const [msg, setMsg] = useState("Waiting for request...");

  useEffect(() => {
    // Facem requestul capcană la backend
    api.get("/games/clue/headers").then((res) => {
      setMsg(res.data.message);
    });
  }, []);

  return (
    <GameWrapper
      gameId="level-6"
      title="Level 6: Header Hunt"
      description="Data doesn't always live in the body."
      hintText="Open Developer Tools -> Network Tab. Reload. Click the request 'headers'. Look at Response Headers.">
      <div className="text-center">
        <p className="font-mono text-sm bg-black text-green-400 p-4 rounded">
          {">"} Server Response Body: "{msg}"
        </p>
      </div>
    </GameWrapper>
  );
}
