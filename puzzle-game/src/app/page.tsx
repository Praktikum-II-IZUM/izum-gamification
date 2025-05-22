'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PuzzleGame } from '@/components/PuzzleGame';
import { BookInfo } from '@/components/BookInfo';
import { BookOpen } from 'lucide-react';
import { BookCover } from '@/types/book';
import slike from '../../db/essential_book_data.json';

export default function Home() {
  const [currentBook, setCurrentBook] = useState<BookCover | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  //const [_gameCompleted, setGameCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRandomBook();
  }, []);

  const loadRandomBook = async () => {
    // Začasno mock data
    const random = Math.floor(Math.random()*20);
    const element = slike[random];
    const mockBook: BookCover = {
      title: element.title,
      author: element.author,
      coverUrl: element.image_url
    };
    // const mockBook: BookCover = {
    //   title: "Mali princ",
    //   author: "Antoine de Saint-Exupéry",
    //   coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=700&h=1000&auto=format"
    // };
    setCurrentBook(mockBook);
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Knjižni Puzzle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <BookInfo book={currentBook} />
            <Button 
              onClick={() => setGameStarted(true)}
              disabled={gameStarted}
              className="w-full"
            >
              Začni igro
            </Button>
            {gameStarted && (
              <PuzzleGame 
                imageSrc={currentBook?.coverUrl || ''}
                rows={2}
                cols={2}
                onComplete={() => {}}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}