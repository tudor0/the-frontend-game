import GameWrapper from "@/components/game/GameWrapper";

export default function Level4() {
  return (
    <GameWrapper
      gameId="level-4"
      title="Level 4: Unclickable"
      description="The input is locked. Unlock it to read the flag."
      hintText="Remove or toggle the disabled attribute on the input.">
      <div className="text-center p-6 space-y-3">
        <p className="text-slate-500">This field is uneditable... or is it?</p>
        <input
          className="w-full border border-slate-200 rounded-md p-2 text-center font-mono"
          value="ATTR_REMOVER"
          disabled
          readOnly
        />
        <p className="text-xs text-slate-400">
          Tip: Right click → Inspect → toggle disabled.
        </p>
      </div>
    </GameWrapper>
  );
}
