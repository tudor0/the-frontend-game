import { useEffect } from "react";
import GameWrapper from "@/components/game/GameWrapper";
import { api } from "@/lib/api";

export default function Level11() {
  useEffect(() => {
    api.get("/games/clue/cookie").catch(() => {
      /* ignore */
    });
  }, []);

  return (
    <GameWrapper
      gameId="level-11"
      title="Level 11: Cookie Monster"
      description="A delicious tracking cookie."
      hintText="Open Application tab → Cookies → look for flag_lvl11.">
      <div className="text-center space-y-2">
        <p className="text-slate-500">We set a tasty cookie for you.</p>
        <p className="text-xs text-slate-400">
          It&apos;s not HttpOnly—check your browser cookies.
        </p>
      </div>
    </GameWrapper>
  );
}
