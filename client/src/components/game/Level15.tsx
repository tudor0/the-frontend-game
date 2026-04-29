import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import GameWrapper from "@/components/game/GameWrapper";
import { toast } from "sonner";

const encoded = btoa("BASE64_DECODER");

export default function Level15() {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(encoded);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy — select the text manually");
    }
  };

  return (
    <GameWrapper
      gameId="level-15"
      title="Level 15: Base64 Decoder"
      description="Decrypt the secret string."
      hintText="Strings ending in = are not encrypted, just encoded."
      tutorial={
        <>
          <p>
            <strong>Concept:</strong> Base64 is an{" "}
            <em>encoding</em> — not encryption. It maps arbitrary bytes
            into a 64-character alphabet (<code>A–Z</code>,{" "}
            <code>a–z</code>, <code>0–9</code>, <code>+</code>,{" "}
            <code>/</code>, padded with <code>=</code>) so binary data
            can survive transports designed for text: email, URLs, JSON,
            HTTP headers. It's fully reversible by anyone — there's no
            key.
          </p>
          <p>
            <strong>Why it matters:</strong> you'll see Base64 everywhere
            — JWT payloads, data URIs (<code>data:image/png;base64,...</code>),
            HTTP <code>Basic</code> auth headers, embedded SVGs, OAuth
            state tokens. Recognising the alphabet and trailing{" "}
            <code>=</code> padding is enough to know "this is just
            encoded, not secret."
          </p>
        </>
      }>
      <div className="text-center space-y-3">
        <p className="text-slate-500">Decode this:</p>
        <div className="relative">
          <p className="font-mono bg-slate-900 text-emerald-400 p-3 pr-12 rounded break-all">
            {encoded}
          </p>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy encoded string"}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-emerald-300 hover:bg-slate-800 hover:text-emerald-200">
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-400">Base64 is your friend.</p>
      </div>
    </GameWrapper>
  );
}
