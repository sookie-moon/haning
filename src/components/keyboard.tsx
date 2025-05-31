
"use client";

import type React from 'react';
import { Button } from "@/components/ui/button";
import { ALPHABET } from '@/config/game-config';

interface KeyboardProps {
  onLetterPress: (letter: string) => void;
  disabledLetters: string[]; 
}

const Keyboard: React.FC<KeyboardProps> = ({ onLetterPress, disabledLetters }) => {
  return (
    <div className="grid grid-cols-6 xs:grid-cols-7 sm:grid-cols-8 md:grid-cols-9 lg:grid-cols-10 gap-1 sm:gap-2 p-1 sm:p-2 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl w-full">
      {ALPHABET.map((letter) => (
        <Button
          key={letter}
          onClick={() => onLetterPress(letter)}
          disabled={disabledLetters.includes(letter)}
          variant="outline"
          size="icon" 
          className="text-sm xs:text-base sm:text-lg font-semibold aspect-square transition-all duration-150 ease-in-out hover:bg-accent/80 focus:ring-2 focus:ring-accent active:scale-95 disabled:opacity-50 disabled:hover:bg-muted disabled:scale-100 p-0"
          aria-label={`Guess letter ${letter}`}
        >
          {letter}
        </Button>
      ))}
    </div>
  );
};

export default Keyboard;
