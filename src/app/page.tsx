
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import CategorySelector from '@/components/category-selector';
import GameBoard from '@/components/game-board';
import Keyboard from '@/components/keyboard';
import GameStatusDialog from '@/components/game-status-dialog';
import OverallResultDialog from '@/components/overall-result-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES, MAX_INCORRECT_GUESSES, type GameCategory } from '@/config/game-config';
import { generateHint, type GenerateHintInput } from '@/ai/flows/generate-hint';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const TOTAL_QUESTIONS_PER_GAME = 10;

type OverallGameStatus = 'category-select' | 'playing-word' | 'word-result' | 'game-over';
type WordOutcome = 'won' | 'lost' | null;

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function HangmanPage() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | null>(null);
  const [gameWords, setGameWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  
  const [overallGameStatus, setOverallGameStatus] = useState<OverallGameStatus>('category-select');
  const [currentWordOutcome, setCurrentWordOutcome] = useState<WordOutcome>(null);
  
  const [hint, setHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [animateCorrectGuess, setAnimateCorrectGuess] = useState(false);

  const { toast } = useToast();

  const loadWord = useCallback((word: string) => {
    setCurrentWord(word.toUpperCase());
    setGuessedLetters([]);
    setIncorrectGuesses([]);
    setHint(null);
    setCurrentWordOutcome(null);
    // Ensure animation reset for next word
    setAnimateCorrectGuess(false); 
  }, []);

  const startGame = useCallback((category: GameCategory) => {
    setSelectedCategory(category);
    const allWords = shuffleArray(category.words);
    const wordsForGame = allWords.slice(0, TOTAL_QUESTIONS_PER_GAME);
    setGameWords(wordsForGame);
    setCurrentQuestionIndex(0);
    setScore(0);
    setOverallGameStatus('playing-word');
    if (wordsForGame.length > 0) {
      loadWord(wordsForGame[0]);
    } else {
      toast({ title: "Error", description: "Not enough words in category.", variant: "destructive" });
      setOverallGameStatus('category-select');
    }
  }, [loadWord, toast]);

  const resetToCategorySelect = () => {
    setOverallGameStatus('category-select');
    setSelectedCategory(null);
    setGameWords([]);
    setCurrentWord('');
    setCurrentQuestionIndex(0);
    setGuessedLetters([]);
    setIncorrectGuesses([]);
    setScore(0);
    setHint(null);
    setCurrentWordOutcome(null);
    setIsLoadingHint(false);
  };

  useEffect(() => {
    if (overallGameStatus !== 'playing-word' || !currentWord) {
      return;
    }

    const wordGuessed = currentWord.split('').every(letter => guessedLetters.includes(letter) || letter === ' ');
    if (wordGuessed) {
      setScore(s => s + 1);
      setCurrentWordOutcome('won');
      setOverallGameStatus('word-result');
      return;
    }

    if (incorrectGuesses.length >= MAX_INCORRECT_GUESSES) {
      setCurrentWordOutcome('lost');
      setOverallGameStatus('word-result');
    }
  }, [guessedLetters, incorrectGuesses, currentWord, overallGameStatus, loadWord]);
  
  useEffect(() => {
    if (animateCorrectGuess) {
      const timer = setTimeout(() => setAnimateCorrectGuess(false), 700);
      return () => clearTimeout(timer);
    }
  }, [animateCorrectGuess]);

  const handleLetterGuess = (letter: string) => {
    if (overallGameStatus !== 'playing-word' || guessedLetters.includes(letter) || incorrectGuesses.includes(letter)) {
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

  const handleProceed = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < gameWords.length) {
      setCurrentQuestionIndex(nextIndex);
      loadWord(gameWords[nextIndex]);
      setOverallGameStatus('playing-word');
    } else {
      setOverallGameStatus('game-over');
    }
  };

  const handleRequestHint = async () => {
    if (!currentWord || !selectedCategory || overallGameStatus !== 'playing-word') return;
    setIsLoadingHint(true);
    const prevStatus = overallGameStatus; 
    setOverallGameStatus('playing-word'); 

    try {
      const input: GenerateHintInput = {
        word: currentWord,
        category: selectedCategory.name,
        incorrectGuesses: incorrectGuesses,
      };
      console.log("Generating hint with input:", input);
      const result = await generateHint(input);
      setHint(result.hint);
      toast({ title: "Hint Received!", description: "Check below the game board for your hint.", variant: "default" });
    } catch (error) {
      console.error("Error generating hint:", error);
      setHint("Sorry, couldn't fetch a hint right now.");
      toast({ title: "Hint Error", description: "Could not fetch a hint.", variant: "destructive" });
    } finally {
      setIsLoadingHint(false);
      setOverallGameStatus('playing-word'); 
    }
  };

  if (overallGameStatus === 'category-select') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 tracking-tighter text-center">Hangin' with Jisook</h1>
        <CategorySelector categories={CATEGORIES} onSelectCategory={startGame} />
      </main>
    );
  }

  const allGuessedLetters = [...guessedLetters, ...incorrectGuesses];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 space-y-3 sm:space-y-4 bg-background text-foreground">
      <header className="w-full max-w-3xl flex justify-between items-center px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">Hangin' with Jisook</h1>
        <Button variant="outline" size="sm" onClick={resetToCategorySelect} aria-label="Change Category">
          <RefreshCw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
          <span className="hidden xs:inline">Change Category</span>
          <span className="xs:hidden">Category</span>
        </Button>
      </header>
      
      <div className="text-xs xxs:text-sm sm:text-base text-muted-foreground w-full max-w-3xl flex flex-col xxs:flex-row xxs:flex-wrap xxs:justify-between items-start xxs:items-center space-y-1 xxs:space-y-0 px-2 sm:px-0">
        <p className="mb-1 xxs:mb-0">Category: <span className="font-semibold text-foreground">{selectedCategory?.name}</span></p>
        <p className="mb-1 xxs:mb-0">Question: <span className="font-semibold text-foreground">{currentQuestionIndex + 1} / {gameWords.length || TOTAL_QUESTIONS_PER_GAME}</span></p>
        <p>Score: <span className="font-semibold text-foreground">{score}</span></p>
      </div>

      <GameBoard
        wordToGuess={currentWord}
        guessedLetters={guessedLetters}
        incorrectGuessCount={incorrectGuesses.length}
        animateCorrectGuess={animateCorrectGuess}
      />

      {hint && (
        <Card className="mt-2 sm:mt-4 w-full max-w-xs sm:max-w-md md:max-w-lg bg-card/70 border-primary/50">
          <CardHeader className="p-2 sm:p-3">
            <CardTitle className="text-xs sm:text-sm font-semibold text-primary flex items-center">
              <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> AI Hint:
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-3 pt-0">
            <p className="text-xs sm:text-sm text-foreground">{hint}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col items-center space-y-3 sm:space-y-4 w-full max-w-xs sm:max-w-md md:max-w-xl">
        <Keyboard 
          onLetterPress={handleLetterGuess} 
          disabledLetters={allGuessedLetters} 
        />
        <Button
          onClick={handleRequestHint}
          disabled={isLoadingHint || hint !== null || overallGameStatus !== 'playing-word'}
          className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground py-2 px-3 sm:py-2 sm:px-4 text-sm sm:text-base"
          aria-label="Get an AI hint"
        >
          <Lightbulb className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          {isLoadingHint ? 'Getting Hint...' : (hint ? 'Hint Received' : 'Get AI Hint')}
        </Button>
      </div>

      <GameStatusDialog
        isOpen={overallGameStatus === 'word-result'}
        status={currentWordOutcome || 'lost'} 
        word={currentWord}
        onConfirm={handleProceed} 
        onClose={handleProceed} 
      />

      <OverallResultDialog
        isOpen={overallGameStatus === 'game-over'}
        score={score}
        totalQuestions={gameWords.length || TOTAL_QUESTIONS_PER_GAME}
        onPlayAgain={resetToCategorySelect}
        onClose={resetToCategorySelect} 
      />
      
      <footer className="text-xs text-muted-foreground pt-4 sm:pt-8">
        <p>&copy; {new Date().getFullYear()} Hangin' with Jisook. All rights reserved.</p>
      </footer>
    </main>
  );
}
