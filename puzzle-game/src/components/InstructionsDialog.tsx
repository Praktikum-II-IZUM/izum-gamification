import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export const InstructionsDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-gray-400 hover:text-white hover:bg-gray-700 p-5 h-16 w-16 flex items-center justify-center rounded-full"
          aria-label="Navodila za igro"
        >
          <HelpCircle 
            className="h-6 w-6" 
            style={{ minWidth: '24px', minHeight: '24px' }} 
          />
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-2 border-gray-700 shadow-xl text-gray-100
        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700 hover:scrollbar-thumb-gray-500
        [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-600
        [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:hover:bg-gray-500"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6 text-gray-100">
            Navodila za igranje
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 px-1">
          {/* Osnove igre */}
          <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-bold text-gray-100 mb-4">
              Cilj igre
            </h3>
            <p className="text-gray-200 leading-relaxed">
              Sestavite puzzle iz delov naslovnice knjige. Ko uspešno sestavite puzzle, 
              boste izvedeli več o knjigi in jo poiskali v COBISS sistemu.
            </p>
          </div>

          {/* Kako igrati */}
          <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-bold text-gray-100 mb-4">
              Kako igrati
            </h3>
            <div className="space-y-4 text-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center">
                  <span className="text-blue-300">↗</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-100">Premikanje delov sestavljanke</p>
                  <p>Povlecite delček puzzle z miško ali dotikom na želeno mesto.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center">
                  <span className="text-purple-300">🔄</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-100">Obračanje delčkov</p>
                  <p>Kliknite enkrat na delček, da ga obrnete za 90°.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-green-600/30 flex items-center justify-center">
                  <span className="text-green-300">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-100">Postavljanje delčkov</p>
                  <p>Delčki se samodejno prilepijo na pravilno mesto, ko so dovolj blizu.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Težavnosti */}
          <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-bold text-gray-100 mb-4">
              Težavnosti
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { level: '2×2', difficulty: 'Zelo lahko', pieces: 4 },
                { level: '2×3', difficulty: 'Lahko', pieces: 6 },
                { level: '3×3', difficulty: 'Srednje', pieces: 9 },
                { level: '3×4', difficulty: 'Težje', pieces: 12 },
                { level: '4×4', difficulty: 'Težko', pieces: 16 },
                { level: '4×5', difficulty: 'Zelo težko', pieces: 20 }
              ].map((item, index) => (
                <div key={index} className="bg-gray-600/40 rounded-lg p-3 border border-gray-500/50 hover:bg-gray-600/70 transition-colors">
                  <p className="font-semibold text-gray-100">{item.level} <span className="text-gray-400">({item.difficulty})</span></p>
                  <p className="text-gray-300 text-sm">{item.pieces} delčkov</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            Uživajte v sestavljanju in spoznavanju slovenske literature!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
