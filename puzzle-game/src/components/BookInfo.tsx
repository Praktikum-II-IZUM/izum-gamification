import React from 'react';
import { Button } from "@/components/ui/button";
import { BookCover } from '@/types/book';
import { ExternalLink } from 'lucide-react';

interface BookInfoProps {
  book: BookCover | null;
}

export const BookInfo: React.FC<BookInfoProps> = ({ book }) => {
  if (!book) return null;

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-xl font-bold">{book.title}</h3>
      
      <div className="space-y-2">
        <div>
          <span className="text-gray-600 font-medium">Avtor: </span>
          <span className="text-gray-900">{book.author}</span>
        </div>
        
        {book.year && (
          <div>
            <span className="text-gray-600 font-medium">Leto izdaje: </span>
            <span className="text-gray-900">{book.year}</span>
          </div>
        )}
        
        {book.publisher && (
          <div>
            <span className="text-gray-600 font-medium">Založba: </span>
            <span className="text-gray-900">{book.publisher}</span>
          </div>
        )}
      </div>
      
      {book.cobissUrl && (
        <div className="pt-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => window.open(book.cobissUrl, '_blank')}
          >
            <span>Odpri v COBISS Plus</span>
            <ExternalLink size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};
