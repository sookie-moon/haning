"use client";

import type React from 'react';
import { Button } from "@/components/ui/button";
import { ALPHABET } from '@/config/game-config';

interface KeyboardProps {
  onLetterPress: (letter: string) => void;
  disabledLetters: string[]; // Already guessed letters (correct or incorrect)
}

const Keyboard: React.FC<KeyboardProps> = ({ onLetterPress, disabledLetters }) => {
  return (
    <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-10 gap-2 p-2 sm:p-4 max-w-xl w-full">
      {ALPHABET.map((letter) => (
        <Button
          key={letter}
          onClick={() => onLetterPress(letter)}
          disabled={disabledLetters.includes(letter)}
          variant="outline"
          className="text-lg sm:text-xl font-semibold aspect-square transition-all duration-150 ease-in-out hover:bg-accent/80 focus:ring-2 focus:ring-accent active:scale-95 disabled:opacity-50 disabled:hover:bg-muted disabled:scale-100"
          aria-label={`Guess letter ${letter}`}
        >
          {letter}
        </Button>
      ))}
    </div>
  );
};

export default Keyboard;
