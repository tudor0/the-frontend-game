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
      hintText="Open Application tab → Local Storage → look for lvl12_flag."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> <code>localStorage</code> is a
            per-origin key/value store the browser exposes to JavaScript.
            It holds strings (~5–10&nbsp;MB), persists across page
            reloads <em>and</em> browser restarts, and is wiped only when
            the user clears site data. The API is dead simple:{" "}
            <code>localStorage.setItem(k, v)</code>,{" "}
            <code>localStorage.getItem(k)</code>,{" "}
            <code>removeItem</code>, <code>clear</code>.
          </p>
          <p>
            <strong>Why it matters:</strong> great for theme settings,
            draft data, recently-viewed lists, offline caches. Bad for
            secrets — anything in <code>localStorage</code> is plaintext
            and readable by any script that runs on your origin, which
            means a single XSS bug can exfiltrate the lot. JWT access
            tokens, in particular, do <em>not</em> belong here.
          </p>
        </>
      }>
      <div className="text-center space-y-2">
        <p className="text-slate-500">We stored something in Local Storage.</p>
        <p className="text-xs text-slate-400">
          It survives refreshes—go find it.
        </p>
      </div>
    </GameWrapper>
  );
}
