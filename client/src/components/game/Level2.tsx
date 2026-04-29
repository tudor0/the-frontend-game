import GameWrapper from "@/components/game/GameWrapper";

export default function Level2() {
  return (
    <GameWrapper
      gameId="level-2"
      title="Level 2: Buried Comments"
      description="Developers often leave TODOs and secrets in the code."
      hintText="Devs leave notes in the markup that the renderer ignores."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> HTML comments —{" "}
            <code>{`<!-- like this -->`}</code> — are stripped from the
            rendered page but ship to the browser as part of the document.
            They show up in <code>View Source</code> and in the DevTools{" "}
            <code>Elements</code> tree as greyed-out nodes.
          </p>
          <p>
            <strong>Why it matters:</strong> developers routinely leave
            TODOs, internal URLs, debug notes, deprecated tokens, and even
            credentials inside HTML comments. Build pipelines should strip
            them in production, but many don't. A serious code-review or
            security checklist always includes "no secrets in comments".
          </p>
        </>
      }>
      <div className="text-center p-6">
        <h3 className="text-xl mb-2">Nothing to see here...</h3>
        <p className="text-slate-500">Just a clean, empty component.</p>

        {/* Comentariu ascuns în DOM */}
        <div
          dangerouslySetInnerHTML={{
            __html: "<!-- Flag: DEV_COMMENTS_ARE_PUBLIC -->"
          }}
        />
      </div>
    </GameWrapper>
  );
}
