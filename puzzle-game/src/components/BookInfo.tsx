import React from 'react';
import { BookCover } from '@/types/book';

interface BookInfoProps {
  book: BookCover | null;
}

export const BookInfo: React.FC<BookInfoProps> = ({ book }) => {
  if (!book) return null;

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-xl font-bold dark:text-gray-900">{book.title}</h3>
      
      <div className="space-y-2">
        <div>
          <span className="text-gray-600 font-medium">Avtor: </span>
          <span className="text-gray-900">{book.author}</span>
        </div>
      </div>
      
      {book.description && (
        <div className="pt-2">
          <span className="text-gray-900">{book.description}</span>
        </div>
      )}
    </div>
  );
};
