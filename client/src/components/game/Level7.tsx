import { useEffect, useState } from "react";
import GameWrapper from "@/components/game/GameWrapper";
import { api } from "@/lib/api";

export default function Level7() {
  const [errorMsg, setErrorMsg] = useState("Waiting for request...");

  useEffect(() => {
    api
      .get("/games/clue/bad-request")
      .then((res) => setErrorMsg(res.data.message || "Check the Network tab"))
      .catch((err) => {
        setErrorMsg(err.response?.data?.error || "Bad Request captured");
      });
  }, []);

  return (
    <GameWrapper
      gameId="level-7"
      title="Level 7: Bad Request"
      description="Errors can leak information."
      hintText="Failed requests are not silent â the server explains what went wrong."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> HTTP responses with{" "}
            <code>4xx</code> status codes (like <code>400 Bad Request</code>{" "}
            or <code>422 Unprocessable Entity</code>) almost always carry a
            JSON body explaining what went wrong — a validation message, a
            field name, sometimes a stack trace. The browser surfaces
            these in the <code>Network</code> tab the same way it does
            successful responses.
          </p>
          <p>
            <strong>Why it matters:</strong> reading error responses is a
            core debugging skill. They tell you exactly which field
            failed, which constraint, sometimes the expected schema. On
            the security side, error bodies <em>also</em> leak information
            — backend stack traces, ORM errors, and validation hints all
            help an attacker map the system. Production APIs should
            sanitise them.
          </p>
        </>
      }>
      <div className="text-center">
        <p className="font-mono text-sm bg-black text-amber-500 p-4 rounded">
          {errorMsg}
        </p>
        <p className="text-xs text-slate-400 mt-2">
          The flag hides inside the failing request payload.
        </p>
      </div>
    </GameWrapper>
  );
}
