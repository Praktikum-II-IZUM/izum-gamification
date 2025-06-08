import { Card, CardHeader, CardTitle } from "./ui/card";
import { InstructionsDialog } from "./InstructionsDialog";
import { StatisticsDialog } from "./StatisticsDialog";

export function AppHeader() {
  return (
    <div className="w-full max-w-4xl mb-6">
      <Card className="bg-gray-800 border-2 border-gray-700">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="min-w-0">
              <CardTitle className="text-3xl font-bold text-gray-100">COBISS Puzzle</CardTitle>
              <p className="text-gray-300 mt-1">Sestavi puzzle in spoznaj svetovno literaturo</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <InstructionsDialog />
              <StatisticsDialog />
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
