import GameWrapper from "@/components/game/GameWrapper";

export default function Level5() {
  return (
    <GameWrapper
      gameId="level-5"
      title="Level 5: Hidden Element"
      description="CSS is hiding the truth."
      hintText="Plenty of CSS techniques can render an element to nothing while keeping it in the DOM."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> CSS gives you several ways to hide
            content while leaving it in the DOM:{" "}
            <code>display: none</code>, <code>visibility: hidden</code>,
            <code>opacity: 0</code>, off-screen positioning, the{" "}
            <code>hidden</code> HTML attribute, and Tailwind's{" "}
            <code>.hidden</code> utility class. Each behaves differently
            (layout, accessibility tree, focusability) but none of them
            remove the element.
          </p>
          <p>
            <strong>Why it matters:</strong> hidden ≠ secret. Admin panels,
            feature-flag-gated UI, debug tools, and even unreleased
            content are sometimes hidden via CSS in production builds —
            and any user can flip it back on with a single line in the{" "}
            <code>Styles</code> panel.
          </p>
        </>
      }>
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
