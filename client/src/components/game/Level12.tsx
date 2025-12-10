import { useEffect } from "react";
import GameWrapper from "@/components/game/GameWrapper";

export default function Level12() {
  useEffect(() => {
    localStorage.setItem("lvl12_flag", "LOCAL_STORAGE_HERO");
  }, []);

  return (
    <GameWrapper
      gameId="level-12"
      title="Level 12: Local Storage"
      description="Data that persists."
      hintText="Open Application tab → Local Storage → look for lvl12_flag.">
      <div className="text-center space-y-2">
        <p className="text-slate-500">We stored something in Local Storage.</p>
        <p className="text-xs text-slate-400">
          It survives refreshes—go find it.
        </p>
      </div>
    </GameWrapper>
  );
}
