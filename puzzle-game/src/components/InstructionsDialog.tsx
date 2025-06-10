import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const InstructionsDialog: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isMobile ? (
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white hover:bg-gray-700 p-5 h-16 w-16 flex items-center justify-center rounded-full"
            aria-label="Navodila za igro"
          >
            <HelpCircle className="h-6 w-6" style={{ minWidth: '24px', minHeight: '24px' }} />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white hover:bg-gray-700 p-5 h-16 w-16 flex items-center justify-center rounded-full"
            aria-label="Navodila za igro"
          >
            <HelpCircle className="h-6 w-6" style={{ minWidth: '24px', minHeight: '24px' }} />
          </Button>
        )}
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
            Navodila za igro
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 px-1">
          {/* Osnove igre */}
          <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-bold text-gray-100 mb-4">
              Cilj igre
            </h3>
            <p className="text-gray-200 leading-relaxed">
              Sestavite puzzle iz delov naslovnice knjige. Ko uspešno sestavite sestavljanko, 
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
                  <span className="text-blue-300">🐬</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-100">Premikanje delov sestavljanke</p>
                  <p>Premaknite puzzle z miško ali dotikom na želeno mesto.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center">
                  <span className="text-purple-300">🦜</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-100">Obračanje delov sestavljanke</p>
                  <p>Kliknite dvakrat na delček, da ga obrnete za 90°.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-green-600/30 flex items-center justify-center">
                  <span className="text-green-300">🦒</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-100">Postavljanje delov sestavljanke</p>
                  <p>Delčki se samodejno prilepijo na pravilno mesto, ko so dovolj blizu.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Točkovanje in medalje */}
          <div className="bg-gray-700/50 rounded-xl p-6 border border-amber-500/30">
            <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
              Točkovanje in medalje
            </h3>
            <div className="space-y-4 text-gray-200">
              <p>Točke se prištevajo glede na:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-semibold">Težavnost:</span> Večja težavnost = več točk</li>
                <li><span className="font-semibold">Čas:</span> Če zaključite v časovni omejitvi, dobite največ točk</li>
                <li><span className="font-semibold">Kazen za čas:</span> Po prekoračitvi časa se točke eksponentno zmanjšujejo</li>
                <li><span className="font-semibold">Kazen za pomoč:</span> Uporaba rešitve zmanjša najvišje možno število točk na 60%</li>
              </ul>
              
              <div className="mt-4">
                <p className="font-semibold mb-2">Dosežite lahko naslednje medalje:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
                    <div className="text-2xl">🥇</div>
                    <p className="font-bold text-amber-400">Zlata medalja</p>
                    <p className="text-sm">100% točk</p>
                  </div>
                  <div className="bg-gray-600/30 border border-gray-500/30 rounded-lg p-3 text-center">
                    <div className="text-2xl">🥈</div>
                    <p className="font-bold text-gray-300">Srebrna medalja</p>
                    <p className="text-sm">60-99% točk</p>
                  </div>
                  <div className="bg-amber-800/30 border border-amber-700/30 rounded-lg p-3 text-center">
                    <div className="text-2xl">🥉</div>
                    <p className="font-bold text-amber-600">Bronasta medalja</p>
                    <p className="text-sm">30-59% točk</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-600/30 p-3 rounded-lg border border-gray-500/30">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-amber-400">Pomembno:</span> Časovna omejitev je odvisna od velikosti sestavljanke.
                </p>
              </div>

              <details className="group">
                <summary className="flex items-center justify-between p-2 -m-2 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors">
                  <span className="text-amber-300 font-medium">Podrobna razlaga točkovanja</span>
                  <svg className="w-5 h-5 text-amber-400 transform transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-3 space-y-4 text-sm text-gray-300">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-amber-300 mb-2">Formula za točkovanje</h4>
                    <div className="bg-gray-900/50 p-3 rounded font-mono text-sm mb-2">
                      Točke = 100 × 2<sup>(težavnost - 1)</sup>
                    </div>
                    <p className="text-xs text-gray-400">
                      Težavnost se povečuje z velikostjo sestavljanke (od 1 za 2×2 do 6 za 4×5).
                      Na primer: 3×3 sestavljanka (težavnost 3) = 100 × 2<sup>2</sup> = 400 točk
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-amber-300 mb-2">Formula za časovno omejitev</h4>
                    <div className="bg-gray-900/50 p-3 rounded font-mono text-sm mb-2">
                      Čas = 10 + (število_delov - 4) × 5 sekund
                    </div>
                    <div className="text-xs text-gray-400">
                      <p>Primeri:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>2×2 (4 deli) = 10 + (4-4) × 5 = 10s</li>
                        <li>3×3 (9 delov) = 10 + (9-4) × 5 = 35s</li>
                        <li>4×4 (16 delov) = 10 + (16-4) × 5 = 70s</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-amber-300 mb-2">Kako deluje kazen za čas?</h4>
                    <div className="bg-gray-900/50 p-3 rounded font-mono text-sm mb-2">
                      Končne_točke = Največ_točk × e<sup>(-0.05 × prekoračeni_čas)</sup>
                    </div>
                    <p className="text-xs text-gray-400">
                      Za vsako sekundo čez časovno omejitev se točke eksponentno zmanjšajo.
                      Na primer: Če prekoračite čas za 10 sekund, boste prejeli približno 60% točk.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-amber-300 mb-2">Kako deluje kazen za pomoč?</h4>
                    <div className="bg-gray-900/50 p-3 rounded font-mono text-sm mb-2">
                      Največ_točk = Originalne_točke × 0.6
                    </div>
                    <p className="text-xs text-gray-400">
                      Če uporabite gumb &quot;Pokaži rešitev&quot;, se vaše najvišje možno število točk zmanjša na 60% prvotne vrednosti.
                      Na primer: Če bi lahko prejeli 1000 točk, boste po uporabi pomoči lahko prejeli največ 600 točk.
                    </p>
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Težavnosti */}
          <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-bold text-gray-100 mb-4">
              Težavnosti
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { level: '2×2', difficulty: 'Zelo lahko', pieces: 4, points: 100 },
                { level: '2×3', difficulty: 'Lahko', pieces: 6, points: 200 },
                { level: '3×3', difficulty: 'Srednje', pieces: 9, points: 400 },
                { level: '3×4', difficulty: 'Težje', pieces: 12, points: 800 },
                { level: '4×4', difficulty: 'Težko', pieces: 16, points: 1600 },
                { level: '4×5', difficulty: 'Zelo težko', pieces: 20, points: 3200 }
              ].map((item, index) => (
                <div key={index} className="bg-gray-600/40 rounded-lg p-3 border border-gray-500/50 hover:bg-gray-600/70 transition-colors">
                  <p className="font-semibold text-gray-100">{item.level} <span className="text-gray-400">({item.difficulty})</span></p>
                  <p className="text-gray-300 text-sm">
                    {item.pieces} delov • do <span className="text-amber-400 font-medium">{item.points} točk</span>
                  </p>
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
