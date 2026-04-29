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
      hintText="Devs leave themselves messages while they are building. Some forget to clean up."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> the browser <code>Console</code> is
            both a JavaScript REPL and the destination for{" "}
            <code>console.log</code>, <code>console.warn</code>,{" "}
            <code>console.error</code> output. Anything the running app
            prints lands here, complete with a clickable file:line link to
            the source. You can also evaluate expressions live —{" "}
            <code>document.cookie</code>,{" "}
            <code>localStorage.getItem(...)</code>, etc.
          </p>
          <p>
            <strong>Why it matters:</strong> debug logs that ship to
            production are a recurring source of leaks. People log API
            responses, user IDs, JWTs, even passwords during development
            and forget to remove them. Build pipelines should strip{" "}
            <code>console.*</code> calls (e.g. via Terser's{" "}
            <code>drop_console</code>), and code review should flag
            anything sensitive going to <code>console.log</code>.
          </p>
        </>
      }>
      <div className="text-center space-y-2">
        <p className="text-slate-500">Developers leave logs everywhere.</p>
        <p className="text-xs text-slate-400">
          Check the Console for the printed flag.
        </p>
      </div>
    </GameWrapper>
  );
}
