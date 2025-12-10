import GameWrapper from "@/components/game/GameWrapper";

export default function Level5() {
  return (
    <GameWrapper
      gameId="level-5"
      title="Level 5: Hidden Element"
      description="CSS is hiding the truth."
      hintText="Look for elements with display: none or hidden classes.">
      <div className="relative p-6 text-center">
        <p className="text-slate-500 mb-2">Nothing to see at first glance.</p>
        <p className="text-slate-400 text-sm">Check the DOM visibility.</p>
        <div className="hidden" aria-hidden="true">
          DISPLAY_NONE_MASTER
        </div>
      </div>
    </GameWrapper>
  );
}
