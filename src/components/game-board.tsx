
"use client";

import type React from 'react';
import HangmanFigure from './hangman-figure';
import { cn } from '@/lib/utils';
import { MAX_INCORRECT_GUESSES } from '@/config/game-config';

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
    <div className={cn(
        "flex flex-col items-center p-3 sm:p-4 md:p-6 rounded-lg shadow-lg bg-card/50 w-fit", 
        animateCorrectGuess && "correct-guess-pulse"
      )}>
      <HangmanFigure incorrectGuessesCount={incorrectGuessCount} />
      
      <div className="flex flex-wrap justify-center space-x-1 sm:space-x-1.5 md:space-x-2 mt-3 sm:mt-4 md:mt-6" aria-label="Word to guess">
        {displayedWord.map((char, index) => (
          <span
            key={index}
            className={cn(
              "letter-tile mb-1", // Added mb-1 for wrapping
              char !== '_' && char !== ' ' && "letter-tile-filled opacity-100 animate-fadeIn",
              char === ' ' && "bg-transparent border-none w-3 sm:w-4 md:w-5 lg:w-6" // Adjusted space widths
            )}
            style={{ animationDelay: char !== '_' ? `${index * 50}ms` : '0ms' }}
          >
            {char === ' ' ? '' : char}
          </span>
        ))}
      </div>

      <div className="mt-3 sm:mt-4 md:mt-6 w-full flex justify-center text-xs sm:text-sm md:text-base">
        <div className="text-center">
          <p className="text-muted-foreground">Incorrect Guesses</p>
          <p className="font-bold text-destructive">{incorrectGuessCount} / {MAX_INCORRECT_GUESSES}</p>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
