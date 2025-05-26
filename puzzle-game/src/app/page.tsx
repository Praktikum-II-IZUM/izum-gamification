'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PuzzleGame } from '@/components/PuzzleGame';
//import { BookInfo } from '@/components/BookInfo';
import { DifficultySelector } from '@/components/DifficultySelector';
import { BookOpen } from 'lucide-react';
import { BookCover } from '@/types/book';
import { useIsMobile } from '@/hooks/use-mobile';
// import slike from '../../db/essential_book_data.json';
// import { db } from '../../db/firestore_init';
import { db, collection, getDocs } from '../../db/firebase_client';

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
  //const [gameCompleted, setGameCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(DIFFICULTIES[0]);
  const isMobile = useIsMobile();

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const startGame = () => {
    setGameStarted(true);
  };
  
  useEffect(() => {
    loadRandomBook();
  }, []);

  const loadRandomBook = async () => {
    
    const booksCollection = collection(db, 'books');
    const snapshot = await getDocs(booksCollection);
    const booksData = snapshot.docs.map(doc => doc.data());
    // console.log(booksData);

    const random = Math.floor(Math.random()*booksData.length);
    const element = booksData[random];
    const realBook: BookCover = {
      title: element.title,
      author: element.author,
      coverUrl: element.image_url
    };

    setCurrentBook(realBook);
    setLoading(false);
  };

  const playAgain = () => {
    setGameStarted(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      {!gameStarted ? (
          <Card className="shadow-lg border-2 border-primary/20 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Izberi težavnost</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-pulse text-lg">Nalaganje naslovnice...</div>
                </div>
              ) : currentBook ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex justify-center">
                    <img
                      src={currentBook.coverUrl} 
                      alt={currentBook.title} 
                      className="h-95 sm:h-120 object-contain rounded-md shadow-md hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{currentBook.title}</h3>
                    <p className="text-gray-600 mb-4">Avtor: {currentBook.author}</p>
                    <DifficultySelector 
                      difficulties={DIFFICULTIES}
                      selected={selectedDifficulty}
                      onChange={handleDifficultyChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-500">Napaka pri nalaganju knjige</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={startGame} 
                disabled={loading || !currentBook}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition-transform duration-300 text-white"
                size={isMobile ? "lg" : "default"}
              >
                Začni igro
              </Button>
              <Button 
                variant="outline" 
                onClick={loadRandomBook}
                disabled={loading}
                className="hover:scale-105 transition-transform duration-300"
                size={isMobile ? "lg" : "default"}
              >
                Nova knjiga
              </Button>
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
        ) : (
          <div className="space-y-6">
            <Card className="shadow-lg border border-primary/20 bg-white/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-xl">
                  {selectedDifficulty.cols}×{selectedDifficulty.rows} Puzzle
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {currentBook && (
                  <PuzzleGame
                    imageSrc={currentBook.coverUrl}
                    rows={selectedDifficulty.rows}
                    cols={selectedDifficulty.cols}
                    onComplete={playAgain}
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={playAgain}
                  className="hover:scale-105 transition-transform duration-300"
                  size={isMobile ? "lg" : "default"}
                >
                  Nazaj na izbiro težavnosti
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
    </div>
  );
}