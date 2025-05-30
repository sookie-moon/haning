
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
import { PartyPopper } from 'lucide-react'; // Using a more celebratory icon
import { cn } from "@/lib/utils";

interface OverallResultDialogProps {
  isOpen: boolean;
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

const OverallResultDialog: React.FC<OverallResultDialogProps> = ({ isOpen, score, totalQuestions, onPlayAgain, onClose }) => {
  if (!isOpen) return null;

  const successRate = totalQuestions > 0 ? score / totalQuestions : 0;
  let title = "Game Over!";
  let description = `You answered ${score} out of ${totalQuestions} questions correctly.`;

  if (successRate >= 0.8) {
    title = "Excellent!";
    description = `Wow! You got ${score} out of ${totalQuestions} correct! Fantastic job!`;
  } else if (successRate >= 0.5) {
    title = "Good Job!";
    description = `Well done! You got ${score} out of ${totalQuestions} correct.`;
  }


  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="items-center">
          <PartyPopper className={cn("h-16 w-16 mb-4 text-primary")} />
          <AlertDialogTitle className="text-3xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground pt-2 text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <Button onClick={onPlayAgain} className="w-full" variant="default">
            Play Again
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OverallResultDialog;
