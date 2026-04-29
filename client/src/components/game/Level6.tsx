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
      hintText="Servers send more than what ends up on the page â the request itself carries metadata."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> every HTTP response has two parts —{" "}
            <em>headers</em> (a list of key/value pairs) and a{" "}
            <em>body</em>. Headers carry metadata: content type, caching
            rules, CORS policy, authentication tokens, rate-limit info,
            and any custom <code>X-*</code> headers the server wants to
            send. They are not part of the rendered page, but the browser
            sees all of them.
          </p>
          <p>
            <strong>Why it matters:</strong> APIs use headers heavily.
            Auth schemes (<code>Authorization</code>,{" "}
            <code>Set-Cookie</code>), versioning, feature flags, security
            policies (CSP, HSTS), and rate-limit budgets all live there.
            When debugging an API, checking headers is just as important
            as reading the body.
          </p>
        </>
      }>
      <div className="text-center">
        <p className="font-mono text-sm bg-black text-green-400 p-4 rounded">
          {">"} Server Response Body: "{msg}"
        </p>
      </div>
    </GameWrapper>
  );
}
