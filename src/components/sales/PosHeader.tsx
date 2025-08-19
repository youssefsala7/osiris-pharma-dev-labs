import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Pause, Play, Trash2 } from "lucide-react";

interface PosHeaderProps {
  onHold: () => void;
  onResume: () => void;
  onClear: () => void;
  cartCount: number;
  total: number;
}

export const PosHeader = ({
  onHold,
  onResume,
  onClear,
  cartCount,
  total,
}: PosHeaderProps) => {
  return (
    <div className="w-full border rounded-lg bg-white p-3 sm:p-4 flex items-center justify-between gap-3">
      <div className="flex items-center min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
          <ShoppingCart className="h-5 w-5" />
        </div>
        <div className="ml-3 min-w-0">
          <div className="font-semibold truncate">Pharmacy POS</div>
          <div className="text-xs text-gray-600">Fast checkout • Scan or type</div>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <Button variant="outline" onClick={onHold}>
          <Pause className="h-4 w-4 mr-2" />
          Hold
        </Button>
        <Button variant="outline" onClick={onResume}>
          <Play className="h-4 w-4 mr-2" />
          Resume
        </Button>
        <Button variant="outline" className="text-red-600" onClick={onClear}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="secondary" className="hidden sm:inline">{cartCount} item{cartCount !== 1 ? "s" : ""}</Badge>
        <div className="text-right">
          <div className="text-xs text-gray-600">Total</div>
          <div className="text-lg sm:text-xl font-bold">${total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};