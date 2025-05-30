
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
import { cn } from "@/lib/utils";

interface GameStatusDialogProps {
  isOpen: boolean;
  status: 'won' | 'lost';
  word?: string;
  onConfirm: () => void; // Renamed from onPlayAgain to onConfirm
  onClose: () => void; 
}

const GameStatusDialog: React.FC<GameStatusDialogProps> = ({ isOpen, status, word, onConfirm, onClose }) => {
  if (!isOpen) return null;

  const title = status === 'won' ? "Congratulations!" : "Too Bad!";
  const description = status === 'won' 
    ? "You've successfully guessed the word!" 
    : `Better luck next time! The word was: ${word}`;

  const Icon = status === 'won' ? Trophy : Skull;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}> {/* onClose handles X or overlay click */}
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader className="items-center">
          <Icon className={cn("h-16 w-16 mb-4", status === 'won' ? 'text-primary' : 'text-destructive')} />
          <AlertDialogTitle className="text-3xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground pt-2 text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          {/* This button now calls onConfirm */}
          <Button onClick={onConfirm} className="w-full" variant={status === 'won' ? 'default' : 'destructive'}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GameStatusDialog;
