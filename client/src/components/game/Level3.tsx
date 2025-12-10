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
      hintText="Open DevTools -> Elements -> <head>. Look for meta tags.">
      <div className="text-center p-6">
        <h3 className="text-xl mb-2">Metadata matters.</h3>
        <p className="text-slate-500">
          The page is telling you something, but not in the body.
        </p>
      </div>
    </GameWrapper>
  );
}
