import GameWrapper from "@/components/game/GameWrapper";

const encoded = btoa("BASE64_DECODER");

export default function Level15() {
  return (
    <GameWrapper
      gameId="level-15"
      title="Level 15: Base64 Decoder"
      description="Decrypt the secret string."
      hintText="Decode the Base64 string to reveal the flag.">
      <div className="text-center space-y-3">
        <p className="text-slate-500">Decode this:</p>
        <p className="font-mono bg-slate-900 text-emerald-400 p-3 rounded">
          {encoded}
        </p>
        <p className="text-xs text-slate-400">Base64 is your friend.</p>
      </div>
    </GameWrapper>
  );
}
