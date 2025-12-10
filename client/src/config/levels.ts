export interface LevelConfig {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const LEVELS: LevelConfig[] = [
  // --- CATEGORIA 1: HTML & DOM ---
  {
    id: "level-1",
    title: "Invisible Ink",
    description: "The text is there, but you cannot see it.",
    difficulty: "Easy"
  },
  {
    id: "level-2",
    title: "Buried Comments",
    description: "Developers often leave notes in the code.",
    difficulty: "Easy"
  },
  {
    id: "level-3",
    title: "Meta Data",
    description: "Information about data.",
    difficulty: "Easy"
  },
  {
    id: "level-4",
    title: "Unclickable",
    description: "The input is locked. Unlock it.",
    difficulty: "Easy"
  },
  {
    id: "level-5",
    title: "Hidden Element",
    description: "CSS is hiding the truth.",
    difficulty: "Medium"
  },

  // --- CATEGORIA 2: NETWORK ---
  {
    id: "level-6",
    title: "Header Hunt",
    description: "Check the response headers.",
    difficulty: "Medium"
  },
  {
    id: "level-7",
    title: "Bad Request",
    description: "Errors can contain useful info.",
    difficulty: "Medium"
  },
  {
    id: "level-8",
    title: "The Long Wait",
    description: "Patience is a virtue (Slow Request).",
    difficulty: "Medium"
  },
  {
    id: "level-9",
    title: "404 Founder",
    description: "The missing page holds the flag.",
    difficulty: "Medium"
  },
  {
    id: "level-10",
    title: "URL Detective",
    description: "Watch what you send in the URL.",
    difficulty: "Hard"
  },

  // --- CATEGORIA 3: BROWSER STORAGE & JS ---
  {
    id: "level-11",
    title: "Cookie Monster",
    description: "A delicious tracking cookie.",
    difficulty: "Easy"
  },
  {
    id: "level-12",
    title: "Local Storage",
    description: "Data that persists.",
    difficulty: "Easy"
  },
  {
    id: "level-13",
    title: "Session Storage",
    description: "Data that vanishes on close.",
    difficulty: "Easy"
  },
  {
    id: "level-14",
    title: "Console Logger",
    description: "Check the JS Console logs.",
    difficulty: "Easy"
  },
  {
    id: "level-15",
    title: "Base64 Decoder",
    description: "Decrypt the secret string.",
    difficulty: "Hard"
  }
];
