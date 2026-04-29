import GameWrapper from "@/components/game/GameWrapper";

export default function Level1() {
  return (
    <GameWrapper
      gameId="level-1"
      title="Level 1: The Invisible Ink"
      description="The flag is right in front of you, but can you see it?"
      hintText="Inspect Element is your friend. Check the HTML styles."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> any element rendered on the page lives in
            the <em>DOM</em> (Document Object Model). CSS can make text
            invisible — for example by matching the text colour to the
            background — but the content itself is still fully present in the
            HTML and accessible to anyone who opens DevTools.
          </p>
          <p>
            <strong>Why it matters:</strong> "hidden" is never a security
            feature on the client. Search-engine crawlers, screen readers,
            scrapers, and curious users can all read the raw markup. Treat the
            entire DOM as public.
          </p>
        </>
      }>
      <div className="text-center select-none">
        <h3 className="text-xl mb-4">Can you find the secret?</h3>
        {/* Trucul: Text alb pe fundal alb */}
        <p className="text-white select-text">Flag: INVISIBLE_INK</p>
      </div>
    </GameWrapper>
  );
}
