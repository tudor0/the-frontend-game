import { useEffect } from "react";
import GameWrapper from "@/components/game/GameWrapper";

export default function Level14() {
  useEffect(() => {
    console.log("Flag:", "CONSOLE_LOG_CHAMP");
  }, []);

  return (
    <GameWrapper
      gameId="level-14"
      title="Level 14: Console Logger"
      description="Check the JS console logs."
      hintText="Open DevTools Console; we logged the flag on load.">
      <div className="text-center space-y-2">
        <p className="text-slate-500">Developers leave logs everywhere.</p>
        <p className="text-xs text-slate-400">
          Check the Console for the printed flag.
        </p>
      </div>
    </GameWrapper>
  );
}
