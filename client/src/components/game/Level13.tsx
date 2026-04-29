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
      hintText="Open Application tab → Session Storage → look for lvl13_flag."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> <code>sessionStorage</code> has the
            exact same API as <code>localStorage</code> —{" "}
            <code>setItem</code>, <code>getItem</code>,{" "}
            <code>removeItem</code> — but its scope is one tab. Closing
            the tab wipes the data. Different tabs of the same origin
            have separate <code>sessionStorage</code> stores.
          </p>
          <p>
            <strong>Why it matters:</strong> use it for one-off,
            tab-scoped flows: a multi-step form draft, an in-progress
            checkout, a wizard's intermediate state. It's safer than{" "}
            <code>localStorage</code> against "I forgot to log out on a
            shared computer," but it carries the same XSS exposure — any
            script on the origin can read it.
          </p>
        </>
      }>
      <div className="text-center space-y-2">
        <p className="text-slate-500">We stored something for this session.</p>
        <p className="text-xs text-slate-400">
          Close the tab and it disappears.
        </p>
      </div>
    </GameWrapper>
  );
}
