import GameWrapper from "@/components/game/GameWrapper";

export default function Level4() {
  return (
    <GameWrapper
      gameId="level-4"
      title="Level 4: Unclickable"
      description="The input is locked. Unlock it to read the flag."
      hintText="Disabling something in the browser is just a UI flag â the underlying value is still there."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> HTML form controls accept attributes
            like <code>disabled</code> and <code>readonly</code> that
            prevent the user from interacting with the field. The{" "}
            <code>value</code> attribute, however, is still right there in
            the markup, and any DOM attribute can be edited live in the{" "}
            <code>Elements</code> panel.
          </p>
          <p>
            <strong>Why it matters:</strong> client-side disabling is
            purely a UX hint — never a security boundary. A motivated user
            can edit attributes, remove disabled states, change hidden form
            values, and resubmit. <em>The server must always re-validate</em>{" "}
            every input, role, and permission. Many real-world bugs come
            from devs assuming "the button is disabled, so they can't do
            it."
          </p>
        </>
      }>
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
