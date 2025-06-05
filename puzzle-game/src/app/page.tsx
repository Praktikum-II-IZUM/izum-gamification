'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PuzzleGame } from '@/components/PuzzleGame';
import { BookInfo } from '@/components/BookInfo';
import { DifficultySelector } from '@/components/DifficultySelector';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { BookOpen } from 'lucide-react';
import { BookCover } from '@/types/book';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from "@/components/ui/use-toast";
// import slike from '../../db/essential_book_data.json';
import { ScoreResult } from '@/utils/scoringSystem';
import { db, collection, getDocs } from '../../db/firebase_client.js';

type Difficulty = {
  cols: number;
  rows: number;
  label: string;
};

const DIFFICULTIES: Difficulty[] = [
  { cols: 2, rows: 2, label: "2×2 (Zelo lahko)" },
  { cols: 2, rows: 3, label: "2×3 (Lahko)" },
  { cols: 3, rows: 3, label: "3×3 (Srednje)" },
  { cols: 3, rows: 4, label: "3×4 (Težje)" },
  { cols: 4, rows: 4, label: "4×4 (Težko)" },
  { cols: 4, rows: 5, label: "4×5 (Zelo težko)" },
];

export default function Home() {
  const [currentBook, setCurrentBook] = useState<BookCover | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(DIFFICULTIES[0]);
  const [finalScore, setFinalScore] = useState<ScoreResult | null>(null);
  const [completionTime, setCompletionTime] = useState(0);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    toast({
      title: "Nova igra",
      description: `Nova igra začeta z težavnostjo: ${selectedDifficulty.label}`,
    });
  };
  
  const handleGameComplete = (scoreResult: ScoreResult, gameTime: number) => {
    setGameCompleted(true);
    setFinalScore(scoreResult);
    setCompletionTime(gameTime);
    toast({
      title: "Čestitamo!",
      description: `Dosegel si ${scoreResult.points} točk in ${scoreResult.rank} rang!`,
    });
  };
  
  useEffect(() => {
    loadRandomBook();
  }, []);

  const loadRandomBook = async () => {
    
    const booksCollection = collection(db, 'books');
    const snapshot = await getDocs(booksCollection);
    const booksData = snapshot.docs.map(doc => doc.data());
    console.log(booksData);

    const random = Math.floor(Math.random()*booksData.length);
    const element = booksData[random];
    const realBook: BookCover = {
      title: element.title,
      author: element.author,
      coverUrl: element.image_url
    };

    setCurrentBook(realBook);
    setGameStarted(false);
    setGameCompleted(false);
    setLoading(false);
    console.log(`Loading: ${loading}`);
  };

  const playAgain = () => {
    setGameStarted(false);
    setGameCompleted(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" className="h-16 w-16" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)]">
        {!gameStarted ? (
          <Card className="shadow-lg border-2 border-gray-700 bg-gray-800 w-full max-w-4xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-gray-100 dark:text-gray-100">COBISS Puzzle</CardTitle>
            </CardHeader>
            <CardContent>
              {currentBook ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex justify-center">
                    <img
                      src={currentBook.coverUrl} 
                      alt={currentBook.title} 
                      className="h-95 sm:h-120 object-contain rounded-md shadow-md hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="w-full max-w-md">
                    <div className="flex flex-col h-full">
                      <div className="min-h-[120px] mb-4">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-gray-100 dark:text-gray-100" title={currentBook.title}>
                          {currentBook.title}
                        </h3>
                        <p className="line-clamp-2 text-gray-100 dark:text-gray-100" title={`Avtor: ${currentBook.author}`}>
                          Avtor: {currentBook.author}
                        </p>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="bg-inherit rounded-lg overflow-hidden max-w-[400px] mx-auto w-full">
                          <div className="pt-4">
                            <DifficultySelector 
                              difficulties={DIFFICULTIES}
                              selected={selectedDifficulty}
                              onChange={handleDifficultyChange}
                              className="w-full px-0"
                            />
                          </div>
                          <div className="pt-2">
                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                              <Button 
                                onClick={startGame} 
                                disabled={!currentBook}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-base py-5 flex-1 shadow-sm hover:shadow-md transition-all duration-200 ease-out font-medium tracking-wide rounded-xl"
                                size="lg"
                              >
                                Začni igro
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={loadRandomBook}
                                className="bg-white hover:bg-gray-300 text-gray-800 border-gray-300 hover:border-gray-400 text-base py-5 flex-1 shadow-sm hover:shadow-md transition-all duration-200 ease-out font-medium tracking-wide rounded-xl"
                                size="lg"
                              >
                                Nova knjiga
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-500">Napaka pri nalaganju knjige</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap justify-center gap-4">
              {currentBook?.cobissUrl && (
                <Button 
                  variant="secondary"
                  onClick={() => window.open(currentBook.cobissUrl, '_blank')}
                  size={isMobile ? "lg" : "default"}
                  className="flex items-center gap-1"
                >
                  <BookOpen className="h-4 w-4" />
                  Odpri v COBISS Plus
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : gameCompleted ? (
          <div className="w-full max-w-4xl my-auto">
            <Card className="shadow-lg border-2 border-gray-700 bg-gray-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-60 z-0"></div>
              <div className="relative z-10">
                <CardHeader className="text-center">
                  <CardTitle className="text-center text-2xl text-green-800">Čestitke!🎉</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="flex justify-center">
                      <div className="relative group">
                        <img 
                          src={currentBook?.coverUrl} 
                          alt={currentBook?.title || "Knjiga"} 
                          className="h-64 sm:h-72 object-contain rounded-md shadow-lg animate-[bounce_1s_ease-in-out] group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      {finalScore && (
                        <ScoreDisplay 
                          scoreResult={finalScore}
                          completionTime={completionTime}
                          rows={selectedDifficulty.rows}
                          cols={selectedDifficulty.cols}
                        />
                      )}
                      <BookInfo book={currentBook} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-center gap-4">
                  <Button 
                    onClick={playAgain}
                    className="bg-gradient-to-r text-gray-900 from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 transition-transform duration-300"
                    size={isMobile ? "lg" : "default"}
                  >
                    Igraj ponovno
                  </Button>
                  {currentBook?.cobissUrl && (
                    <Button 
                      variant="secondary"
                      onClick={() => window.open(currentBook.cobissUrl, '_blank')}
                      size={isMobile ? "lg" : "default"}
                      className="hover:scale-105 transition-transform duration-300"
                    >
                      Odpri v COBISS Plus
                    </Button>
                  )}
                </CardFooter>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-full max-w-6xl mx-auto">
              <Card className="shadow-lg border border-gray-700 bg-gray-800 w-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-2xl md:text-3xl text-gray-100 dark:text-gray-100">
                    {selectedDifficulty.cols}×{selectedDifficulty.rows} Puzzle
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 md:px-8 pb-6">
                  {currentBook && (
                    <div className="flex justify-center w-full">
                      <div className="w-full max-w-[1400px]">
                        <PuzzleGame
                          imageSrc={currentBook.coverUrl}
                          rows={selectedDifficulty.rows}
                          cols={selectedDifficulty.cols}
                          onComplete={handleGameComplete}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-center pb-6">
                  <Button 
                    variant="outline" 
                    onClick={playAgain}
                    className="hover:scale-105 transition-transform duration-300 px-8 py-2 text-base md:text-lg dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:border-gray-300"
                    size={isMobile ? "lg" : "default"}
                  >
                    Nazaj na izbiro težavnosti
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}