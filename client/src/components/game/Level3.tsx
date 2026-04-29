import { useEffect } from "react";
import GameWrapper from "@/components/game/GameWrapper";

export default function Level3() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "flag-level-3";
    meta.content = "META_DATA_KING";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <GameWrapper
      gameId="level-3"
      title="Level 3: Meta Data"
      description="Inspect the document metadata to uncover the secret."
      hintText="The body of the page is a dead end â the document has more to it than what is rendered."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> every HTML document has a{" "}
            <code>{`<head>`}</code> section that holds metadata about the
            page rather than its visible content. Inside the head,{" "}
            <code>{`<meta>`}</code> tags carry key/value information: page
            description, charset, viewport, OpenGraph previews, Twitter
            cards, and custom app data.
          </p>
          <p>
            <strong>Why it matters:</strong> meta tags are how SEO,
            social-media unfurls, analytics scripts, and CSP policies are
            configured. Anything you put in <code>{`<head>`}</code> is
            public and indexable — it's a common place to find feature
            flags, build hashes, and sometimes leaked configuration.
          </p>
        </>
      }>
      <div className="text-center p-6">
        <h3 className="text-xl mb-2">Metadata matters.</h3>
        <p className="text-slate-500">
          The page is telling you something, but not in the body.
        </p>
      </div>
    </GameWrapper>
  );
}
