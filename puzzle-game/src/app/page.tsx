'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PuzzleGame } from '@/components/PuzzleGame';
import { BookInfo } from '@/components/BookInfo';
import { BookOpen } from 'lucide-react';
import { BookCover } from '@/types/book';
import slike from '../../db/essential_book_data.json';
// import { db } from '../../db/firestore_init';
import { db, collection, getDocs } from '../../db/firebase_client';

export default function Home() {
  const [currentBook, setCurrentBook] = useState<BookCover | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  //const [gameCompleted, setGameCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

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