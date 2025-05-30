"use client";

import type React from 'react';
import HangmanFigure from './hangman-figure';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  wordToGuess: string;
  guessedLetters: string[];
  incorrectGuessCount: number;
  animateCorrectGuess?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ wordToGuess, guessedLetters, incorrectGuessCount, animateCorrectGuess }) => {
  const displayedWord = wordToGuess
    .split('')
    .map((letter) => (guessedLetters.includes(letter) || letter === ' ' ? letter : '_'));

  return (
    <div className={cn("flex flex-col items-center p-4 md:p-6 rounded-lg shadow-lg bg-card/50", animateCorrectGuess && "correct-guess-pulse")}>
      <HangmanFigure incorrectGuessesCount={incorrectGuessCount} />
      <div className="flex space-x-1 sm:space-x-2 mt-4 sm:mt-6" aria-label="Word to guess">
        {displayedWord.map((char, index) => (
          <span
            key={index}
            className={cn(
              "letter-tile",
              char !== '_' && char !== ' ' && "letter-tile-filled opacity-100 animate-fadeIn",
              char === ' ' && "bg-transparent border-none w-4 sm:w-6" // Style for spaces
            )}
            style={{ animationDelay: char !== '_' ? `${index * 50}ms` : '0ms' }}
          >
            {char === ' ' ? '' : char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;

// Add fadeIn animation to globals.css if needed or use Tailwind's animate-ping/pulse for simplicity
// For now, opacity transition is fine.
// A simple fadeIn can be:
// @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
// .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
// This should ideally be in globals.css, but for brevity, it's implied.
// The current letter-tile styles in globals.css already provide good visual distinction.
