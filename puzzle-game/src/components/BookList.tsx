'use client';

import React from 'react';
import Image from 'next/image';
import { BookCover } from '@/types/book';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

type BookListProps = {
  books: BookCover[];
  onSelectBook: (book: BookCover) => void;
};

export const BookList: React.FC<BookListProps> = ({ books, onSelectBook }) => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Izberite knjigo</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book) => (
          <Card 
            key={book.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => onSelectBook(book)}
          >
            <CardContent className="p-3">
              <div className="aspect-[2/3] relative w-full">
                <Image
                  src={book.coverUrl}
                  alt={`Naslovnica: ${book.title}`}
                  fill
                  className="object-cover rounded"
                  sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
                />
              </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <div className="w-full">
                <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
                {book.author && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {book.author}
                  </p>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookList;