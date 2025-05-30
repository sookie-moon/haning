"use client";

import type React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Skull } from 'lucide-react';

interface GameStatusDialogProps {
  isOpen: boolean;
  status: 'won' | 'lost';
  word?: string; // The word that was being guessed, show if lost
  onPlayAgain: () => void;
  onClose: () => void; // For controlled component if needed, or can be managed internally
}

const GameStatusDialog: React.FC<GameStatusDialogProps> = ({ isOpen, status, word, onPlayAgain, onClose }) => {
  if (!isOpen) return null;

  const title = status === 'won' ? "Congratulations!" : "Game Over!";
  const description = status === 'won' 
    ? "You've successfully guessed the word!" 
    : `Better luck next time! The word was: ${word}`;

  const Icon = status === 'won' ? Trophy : Skull;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader className="items-center">
          <Icon className={cn("h-16 w-16 mb-4", status === 'won' ? 'text-primary' : 'text-destructive')} />
          <AlertDialogTitle className="text-3xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground pt-2 text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <Button onClick={onPlayAgain} className="w-full" variant={status === 'won' ? 'default' : 'destructive'}>
            Play Again
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GameStatusDialog;
