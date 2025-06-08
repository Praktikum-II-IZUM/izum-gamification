'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PuzzleGame } from '@/components/PuzzleGame';
import { BookInfo } from '@/components/BookInfo';
import { DifficultySelector } from '@/components/DifficultySelector';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { BookOpen } from 'lucide-react';
import { BookCover } from '@/types/book';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from "@/components/ui/use-toast";
import { AppHeader } from '@/components/AppHeader';
// import slike from '../../db/essential_book_data.json';
import { ScoreResult } from '@/utils/scoringSystem';
import { db, collection, getDocs, auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';

import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';

export default function Home() {
  const { currentUser } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  console.log(currentUser);

  if (currentUser) {
    return <Page />;
  }

  return showSignUp ? (
    <SignUp onSwitchToSignIn={() => setShowSignUp(false)} />
  ) : (
    <SignIn onSwitchToSignUp={() => setShowSignUp(true)} />
  );
}

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

const Page = () => {
  const [currentBook, setCurrentBook] = useState<BookCover | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(DIFFICULTIES[0]);
  const [finalScore, setFinalScore] = useState<ScoreResult | null>(null);
  const [completionTime, setCompletionTime] = useState(0);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { setCurrentUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    toast({
      title: "Nova igra",
      description: ` ${selectedDifficulty.label}`,
    });
  };

  const handleGameComplete = (scoreResult: ScoreResult, gameTime: number) => {
    setGameCompleted(true);
    setFinalScore(scoreResult);
    setCompletionTime(gameTime);
    toast({
      title: "Čestitamo!",
      description: `${scoreResult.points} od ${scoreResult.maxPoints} točk`,
    });
  };
  
  const loadRandomBook = useCallback(async () => {
    const loadingTimeout = setTimeout(() => setLoading(true), 300);

    try {
      const booksCollection = collection(db, 'books');
      const snapshot = await getDocs(booksCollection);

      if (snapshot.empty) {
        throw new Error('Ni najdenih knjig v bazi podatkov');
      }

      const booksData = snapshot.docs.map(doc => doc.data());
      const random = Math.floor(Math.random() * booksData.length);
      const element = booksData[random];

      if (!element || !element.title || !element.author || !element.image_url) {
        throw new Error('Neveljavni podatki knjige');
      }

      const realBook: BookCover = {
        title: element.title,
        author: element.author,
        coverUrl: element.image_url,
        cobissUrl: element.book_url,
        description: element.description || ''
      };

      setCurrentBook(realBook);
      setGameStarted(false);
      setGameCompleted(false);
    } catch (error) {
      console.error('Napaka pri nalaganju knjige:', error);
      toast({
        title: 'Napaka',
        description: 'Prišlo je do napake pri nalaganju knjige. Poskusite znova.'
      });
    } finally {
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    loadRandomBook();
  }, [loadRandomBook]);

  const playAgain = () => {
    setGameStarted(false);
    setGameCompleted(false);
  };

  const openCobiss = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (currentBook?.cobissUrl) {
      window.open(currentBook.cobissUrl, '_blank', 'noopener,noreferrer');
    }
  }, [currentBook?.cobissUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" className="h-16 w-16 mx-auto mb-4 text-white" />
          <p className="text-white text-lg">Nalagam knjigo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)]">
        <AppHeader onSignOut={handleSignOut} />
        {!gameStarted ? (
          <div className="w-full max-w-4xl">
            <Card className="shadow-lg border-2 border-gray-700 bg-gray-800 w-full">
              <CardContent className="py-12 px-8">
                {currentBook ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="flex justify-center">
                      <div className="relative h-[380px] w-[250px] sm:h-[480px] sm:w-[316px] group overflow-hidden rounded-md">
                        <Image
                          src={currentBook.coverUrl}
                          alt={currentBook.title}
                          fill
                          className="object-cover rounded-md shadow-md transform-gpu will-change-transform transition-all duration-300 ease-out group-hover:scale-105 cursor-pointer"
                          onClick={openCobiss}
                          unoptimized={!currentBook.coverUrl.startsWith('/')}
                          loading="eager"
                        />
                        {currentBook.cobissUrl && (
                          <>
                            <div 
                              className="absolute bottom-3 right-3 bg-gray-800/90 hover:bg-gray-700/90 text-white px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer backdrop-blur-sm hover:backdrop-blur transition-all duration-200 flex items-center shadow-sm hover:shadow"
                              onClick={openCobiss}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                              COBISS
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-full max-w-md">
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
                ) : (
                  <div className="text-center py-8">
                    <p className="text-red-500">Napaka pri nalaganju knjige</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-wrap justify-center gap-4">
                {/* Ostali gumbi, če obstajajo */}
              </CardFooter>
            </Card>
          </div>
        ) : gameCompleted ? (
          <div className="w-full max-w-4xl my-auto">
            <Card className="shadow-lg border-2 border-gray-700 bg-gray-800 w-full">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-center text-2xl md:text-3xl text-gray-100 flex items-center justify-center gap-2">
                  <span className="text-2xl">🎉</span>
                  Čestitke!
                  <span className="text-2xl">🎉</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {currentBook ? (
                    <>
                      <div className="space-y-6 w-full">
                        <div className="w-full flex justify-center">
                          <div className="relative w-full max-w-[280px] aspect-[2/3] group overflow-hidden rounded-md">
                            <Image
                              src={currentBook.coverUrl}
                              alt={currentBook.title}
                              fill
                              className="object-cover rounded-md shadow-md transform-gpu will-change-transform transition-all duration-300 ease-out group-hover:scale-105 cursor-pointer"
                              onClick={() => currentBook.cobissUrl && window.open(currentBook.cobissUrl, '_blank', 'noopener,noreferrer')}
                              unoptimized={!currentBook.coverUrl.startsWith('/')}
                            />
                            {currentBook.cobissUrl && (
                              <div 
                                className="absolute bottom-3 right-3 bg-gray-800/90 hover:bg-gray-700/90 text-white px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer backdrop-blur-sm hover:backdrop-blur transition-all duration-200 flex items-center shadow-sm hover:shadow"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(currentBook.cobissUrl, '_blank', 'noopener,noreferrer');
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                  <polyline points="15 3 21 3 21 9"></polyline>
                                  <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                                COBISS
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 text-gray-200 w-full">
                          <BookInfo book={currentBook} />
                        </div>
                      </div>
                      <div className="space-y-6">
                        {finalScore && (
                          <div className="bg-gray-700/50 rounded-lg p-0">
                            <ScoreDisplay 
                              scoreResult={finalScore}
                              completionTime={completionTime}
                              rows={selectedDifficulty.rows}
                              cols={selectedDifficulty.cols}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-red-400">Knjiga ni bila najdena. Poskusite znova.</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-center gap-4 pb-6 px-6">
                <Button
                  onClick={playAgain}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-5 hover:scale-105 transition-transform duration-300 rounded-xl shadow-md w-full sm:w-auto justify-center text-base"
                  size={isMobile ? "lg" : "default"}
                >
                  Igraj ponovno
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 w-full max-w-4xl">
            <Card className="shadow-lg border-2 border-gray-700 bg-gray-800 w-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-center text-2xl md:text-3xl text-gray-100 dark:text-gray-100">
                  {selectedDifficulty.cols}×{selectedDifficulty.rows} Puzzle
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-4 md:px-8 pb-6">
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
        )}
      </div>
    </div>
  );
}