import { Button } from "./ui/button";
import { BarChart3 } from "lucide-react";
import { InstructionsDialog } from "./InstructionsDialog";
import { Card, CardHeader, CardTitle } from "./ui/card";

export function AppHeader() {
  return (
    <div className="w-full max-w-4xl mb-6">
      <Card className="bg-gray-800 border-2 border-gray-700">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="min-w-0">
              <CardTitle className="text-3xl font-bold text-gray-100">COBISS Puzzle</CardTitle>
              <p className="text-gray-300 mt-1">Sestavi puzzle in spoznaj slovensko literaturo</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <InstructionsDialog />
              <Button 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-gray-700 p-5 h-16 w-16 flex items-center justify-center rounded-full"
                onClick={() => {
                  alert('Informacije o aplikaciji bodo prikazane tukaj.');
                }}
              >
                <BarChart3 
                    className="h-6 w-6" 
                    style={{ minWidth: '24px', minHeight: '24px' }} 
                />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
