import { useEffect } from "react";
import GameWrapper from "@/components/game/GameWrapper";

export default function Level13() {
  useEffect(() => {
    sessionStorage.setItem("lvl13_flag", "SESSION_STORAGE_SAVER");
  }, []);

  return (
    <GameWrapper
      gameId="level-13"
      title="Level 13: Session Storage"
      description="Data that vanishes on close."
      hintText="Open Application tab → Session Storage → look for lvl13_flag.">
      <div className="text-center space-y-2">
        <p className="text-slate-500">We stored something for this session.</p>
        <p className="text-xs text-slate-400">
          Close the tab and it disappears.
        </p>
      </div>
    </GameWrapper>
  );
}
