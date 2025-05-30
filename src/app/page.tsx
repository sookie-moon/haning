"use client";

import React, { useState, useEffect, useCallback } from 'react';
import CategorySelector from '@/components/category-selector';
import GameBoard from '@/components/game-board';
import Keyboard from '@/components/keyboard';
import GameStatusDialog from '@/components/game-status-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES, MAX_INCORRECT_GUESSES, type GameCategory } from '@/config/game-config';
import { generateHint, type GenerateHintInput } from '@/ai/flows/generate-hint';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

type GameStatus = 'category-select' | 'playing' | 'won' | 'lost' | 'hinting';

export default function HangmanPage() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | null>(null);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('category-select');
  const [hint, setHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [animateCorrectGuess, setAnimateCorrectGuess] = useState(false);

  const { toast } = useToast();

  const pickRandomWord = useCallback((category: GameCategory): string => {
    const randomIndex = Math.floor(Math.random() * category.words.length);
    return category.words[randomIndex].toUpperCase();
  }, []);

  const startGame = useCallback((category: GameCategory) => {
    setSelectedCategory(category);
    const newWord = pickRandomWord(category);
    setCurrentWord(newWord);
    setGuessedLetters([]);
    setIncorrectGuesses([]);
    setHint(null);
    setGameStatus('playing');
  }, [pickRandomWord]);

  const resetGame = () => {
    setGameStatus('category-select');
    setSelectedCategory(null);
    setCurrentWord('');
  };

  useEffect(() => {
    if (gameStatus === 'playing' && currentWord) {
      const wordGuessed = currentWord.split('').every(letter => guessedLetters.includes(letter) || letter === ' ');
      if (wordGuessed) {
        setGameStatus('won');
        return;
      }
      if (incorrectGuesses.length >= MAX_INCORRECT_GUESSES) {
        setGameStatus('lost');
      }
    }
  }, [guessedLetters, incorrectGuesses, currentWord, gameStatus]);
  
  useEffect(() => {
    if (animateCorrectGuess) {
      const timer = setTimeout(() => setAnimateCorrectGuess(false), 700); // Duration of pulse animation
      return () => clearTimeout(timer);
    }
  }, [animateCorrectGuess]);

  const handleLetterGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter) || incorrectGuesses.includes(letter)) {
      return;
    }

    if (currentWord.includes(letter)) {
      setGuessedLetters(prev => [...prev, letter]);
      setAnimateCorrectGuess(true);
      toast({ title: "Correct!", description: `The letter "${letter}" is in the word.`, variant: "default" });
    } else {
      setIncorrectGuesses(prev => [...prev, letter]);
      toast({ title: "Incorrect!", description: `The letter "${letter}" is not in the word.`, variant: "destructive" });
    }
  };

  const handleRequestHint = async () => {
    if (!currentWord || !selectedCategory) return;
    setIsLoadingHint(true);
    setGameStatus('hinting');
    try {
      const input: GenerateHintInput = {
        word: currentWord,
        category: selectedCategory.name,
        incorrectGuesses: incorrectGuesses,
      };
      const result = await generateHint(input);
      setHint(result.hint);
      toast({ title: "Hint Received!", description: "Check below the game board for your hint.", variant: "default" });
    } catch (error) {
      console.error("Error generating hint:", error);
      setHint("Sorry, couldn't fetch a hint right now.");
      toast({ title: "Hint Error", description: "Could not fetch a hint.", variant: "destructive" });
    } finally {
      setIsLoadingHint(false);
      setGameStatus('playing'); // Return to playing state
    }
  };

  if (gameStatus === 'category-select') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
        <h1 className="text-5xl font-extrabold mb-8 tracking-tighter text-center">Hangin' with Jisook</h1>
        <CategorySelector categories={CATEGORIES} onSelectCategory={startGame} />
      </main>
    );
  }

  const incorrectGuessCount = incorrectGuesses.length;
  const allGuessedLetters = [...guessedLetters, ...incorrectGuesses];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 space-y-4 bg-background text-foreground">
      <header className="w-full max-w-3xl flex justify-between items-center px-2 sm:px-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">Hangin' with Jisook</h1>
        <Button variant="outline" size="sm" onClick={resetGame} aria-label="Change Category">
          <RefreshCw className="mr-2 h-4 w-4" /> Change Category
        </Button>
      </header>
      
      <p className="text-lg text-muted-foreground">Category: <span className="font-semibold text-foreground">{selectedCategory?.name}</span></p>

      <GameBoard
        wordToGuess={currentWord}
        guessedLetters={guessedLetters}
        incorrectGuessCount={incorrectGuessCount}
        animateCorrectGuess={animateCorrectGuess}
      />

      {hint && (
        <Card className="mt-4 w-full max-w-xl bg-card/70 border-primary/50">
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-semibold text-primary flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" /> AI Hint:
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-sm text-foreground">{hint}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col items-center space-y-4 w-full max-w-xl">
        <Keyboard onLetterPress={handleLetterGuess} disabledLetters={allGuessedLetters} />
        <Button
          onClick={handleRequestHint}
          disabled={isLoadingHint || hint !== null || gameStatus !== 'playing'}
          className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
          aria-label="Get an AI hint"
        >
          <Lightbulb className="mr-2 h-5 w-5" />
          {isLoadingHint ? 'Getting Hint...' : (hint ? 'Hint Received' : 'Get AI Hint')}
        </Button>
      </div>

      <GameStatusDialog
        isOpen={gameStatus === 'won' || gameStatus === 'lost'}
        status={gameStatus === 'won' ? 'won' : 'lost'}
        word={currentWord}
        onPlayAgain={resetGame}
        onClose={() => setGameStatus('playing')} // Or reset to category select
      />
      
      <footer className="text-xs text-muted-foreground pt-8">
        <p>&copy; {new Date().getFullYear()} Hangin' with Jisook. All rights reserved.</p>
      </footer>
    </main>
  );
}
