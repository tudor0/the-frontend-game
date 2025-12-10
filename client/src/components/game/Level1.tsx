import GameWrapper from "@/components/game/GameWrapper";

export default function Level1() {
  return (
    <GameWrapper
      gameId="level-1"
      title="Level 1: The Invisible Ink"
      description="The flag is right in front of you, but can you see it?"
      hintText="Inspect Element is your friend. Check the HTML styles.">
      <div className="text-center select-none">
        <h3 className="text-xl mb-4">Can you find the secret?</h3>
        {/* Trucul: Text alb pe fundal alb */}
        <p className="text-white select-text">Flag: INVISIBLE_INK</p>
      </div>
    </GameWrapper>
  );
}
