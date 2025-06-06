
"use client";

import type React from 'react';

interface HangmanFigureProps {
  incorrectGuessesCount: number;
}

const HangmanFigure: React.FC<HangmanFigureProps> = ({ incorrectGuessesCount }) => {
  // Define colors from the theme for different parts
  const gallowsColor = "hsl(var(--muted))"; 
  const ropeColor = "hsl(var(--muted-foreground))"; 
  const figureHeadStrokeColor = "#f2cc8f"; // New color for hangman
  const figureBodyColor = "#f2cc8f"; // New color for hangman
  const headFillColor = "hsl(var(--background))"; // Background color for the head fill

  // Define stroke widths
  const strokeWidthGallows = "4";
  const strokeWidthRope = "3";
  const strokeWidthFigure = "3.5"; 

  // SVG line properties for a smoother look
  const strokeLinecapRound = "round" as React.SVGAttributes<SVGElement>["strokeLinecap"];
  const strokeLinejoinRound = "round" as React.SVGAttributes<SVGElement>["strokeLinejoin"];

  const figureParts = [
    // Base of the gallows
    <line key="base" x1="10" y1="110" x2="90" y2="110" stroke={gallowsColor} strokeWidth={strokeWidthGallows} strokeLinecap={strokeLinecapRound} />,
    // Pole of the gallows
    <line key="pole" x1="30" y1="110" x2="30" y2="10" stroke={gallowsColor} strokeWidth={strokeWidthGallows} strokeLinecap={strokeLinecapRound} />,
    // Beam of the gallows
    <line key="beam" x1="28" y1="10" x2="70" y2="10" stroke={gallowsColor} strokeWidth={strokeWidthGallows} strokeLinecap={strokeLinecapRound} />,
    // Rope
    <line key="rope" x1="70" y1="10" x2="70" y2="30" stroke={ropeColor} strokeWidth={strokeWidthRope} strokeLinecap={strokeLinecapRound} />,
    // Head
    <circle key="head" cx="70" cy="40" r="10" stroke={figureHeadStrokeColor} strokeWidth={strokeWidthFigure} fill={headFillColor} />,
    // Body
    <line key="body" x1="70" y1="50" x2="70" y2="80" stroke={figureBodyColor} strokeWidth={strokeWidthFigure} strokeLinecap={strokeLinecapRound} />,
    // Left Arm
    <line key="left-arm" x1="70" y1="60" x2="50" y2="70" stroke={figureBodyColor} strokeWidth={strokeWidthFigure} strokeLinecap={strokeLinecapRound} strokeLinejoin={strokeLinejoinRound} />,
    // Right Arm
    <line key="right-arm" x1="70" y1="60" x2="90" y2="70" stroke={figureBodyColor} strokeWidth={strokeWidthFigure} strokeLinecap={strokeLinecapRound} strokeLinejoin={strokeLinejoinRound} />,
    // Left Leg
    <line key="left-leg" x1="70" y1="80" x2="50" y2="100" stroke={figureBodyColor} strokeWidth={strokeWidthFigure} strokeLinecap={strokeLinecapRound} strokeLinejoin={strokeLinejoinRound} />,
    // Right Leg
    <line key="right-leg" x1="70" y1="80" x2="90" y2="100" stroke={figureBodyColor} strokeWidth={strokeWidthFigure} strokeLinecap={strokeLinecapRound} strokeLinejoin={strokeLinejoinRound} />,
  ];

  return (
    <svg viewBox="0 0 100 120" className="w-40 h-48 sm:w-48 sm:h-56 md:w-56 md:h-64 drop-shadow-lg">
      {/* Always draw gallows structure */}
      {figureParts.slice(0, 3)} {/* Base, Pole, Beam */}
      {figureParts[3]} {/* Rope */}

      {/* Draw character parts based on incorrect guesses */}
      {figureParts.slice(4, 4 + incorrectGuessesCount)}
    </svg>
  );
};

export default HangmanFigure;
