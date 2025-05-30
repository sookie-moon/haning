export type GameCategory = {
  id: string;
  name: string;
  words: string[];
  icon?: React.ComponentType<{ className?: string }>;
};

// For icons, you would typically import them, e.g., import { Film, Music } from "lucide-react";
// However, to keep this config simple, we'll handle icons in the CategorySelector component.

export const CATEGORIES: GameCategory[] = [
  { 
    id: "movies",
    name: "Movies", 
    words: ["INCEPTION", "TITANIC", "AVATAR", "INTERSTELLAR", "PARASITE", "GLADIATOR", "ALIEN", "PULPFICTION"] 
  },
  { 
    id: "music",
    name: "Music Artists", 
    words: ["QUEEN", "BEATLES", "MADONNA", "NIRVANA", "ADELE", "DRAKE", "RIHANNA", "METALLICA"] 
  },
  {
    id: "countries",
    name: "Countries",
    words: ["CANADA", "BRAZIL", "JAPAN", "AUSTRALIA", "GERMANY", "INDIA", "EGYPT", "ARGENTINA"]
  },
  {
    id: "animals",
    name: "Animals",
    words: ["ELEPHANT", "TIGER", "DOLPHIN", "PENGUIN", "GIRAFFE", "KANGAROO", "ZEBRA", "CROCODILE"]
  }
];

export const MAX_INCORRECT_GUESSES = 6;

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
