
"use client";

import type React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GameCategory } from '@/config/game-config';
import { Film, Music, Globe, Dog } from 'lucide-react'; 

interface CategorySelectorProps {
  categories: GameCategory[];
  onSelectCategory: (category: GameCategory) => void;
  disabled?: boolean;
}

const CategoryIcon: React.FC<{ categoryId: string; className?: string }> = ({ categoryId, className }) => {
  switch (categoryId) {
    case 'movies':
      return <Film className={className} />;
    case 'music':
      return <Music className={className} />;
    case 'countries':
      return <Globe className={className} />;
    case 'animals':
      return <Dog className={className} />;
    default:
      return null;
  }
};

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, onSelectCategory, disabled }) => {
  return (
    <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl md:text-3xl text-center font-bold tracking-tight">Choose a Category</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-6">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            variant="outline"
            size="lg"
            className="w-full h-16 sm:h-20 text-sm sm:text-base md:text-lg justify-start p-3 sm:p-4 hover:bg-accent/20 transition-all duration-200 ease-in-out transform hover:scale-105"
            disabled={disabled}
            aria-label={`Select category: ${category.name}`}
          >
            <CategoryIcon categoryId={category.id} className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />
            {category.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategorySelector;
