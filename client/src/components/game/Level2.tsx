import GameWrapper from "@/components/game/GameWrapper";

export default function Level2() {
  return (
    <GameWrapper
      gameId="level-2"
      title="Level 2: Buried Comments"
      description="Developers often leave TODOs and secrets in the code."
      hintText="Right click -> Inspect Element. Look for greyed out text inside the HTML structure.">
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
