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
      hintText="Open Application tab → Cookies → look for flag_lvl11."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> cookies are small key/value pairs
            the browser stores per origin and{" "}
            <em>automatically attaches to every matching request</em>{" "}
            (subject to <code>Domain</code>, <code>Path</code>,{" "}
            <code>SameSite</code> rules). They power sessions, login
            state, language preferences, and tracking. The server sets
            them with the <code>Set-Cookie</code> response header.
          </p>
          <p>
            <strong>Why it matters:</strong> cookie security depends on
            three flags. <code>HttpOnly</code> prevents JS access (so XSS
            can't read the cookie). <code>Secure</code> forces HTTPS-only
            transmission. <code>SameSite=Lax|Strict</code> protects
            against CSRF. A session cookie without{" "}
            <code>HttpOnly</code> is a textbook vulnerability — and it's
            also exactly what makes <em>this</em> level solvable.
          </p>
        </>
      }>
      <div className="text-center space-y-2">
        <p className="text-slate-500">We set a tasty cookie for you.</p>
        <p className="text-xs text-slate-400">
          It&apos;s not HttpOnly—check your browser cookies.
        </p>
      </div>
    </GameWrapper>
  );
}
