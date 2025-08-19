import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export type HoldCart = {
  id: string;
  createdAt: string;
  itemsCount: number;
  total: number;
  note?: string;
};

interface HoldCartsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holds: HoldCart[];
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HoldCartsDialog = ({
  open,
  onOpenChange,
  holds,
  onResume,
  onDelete,
}: HoldCartsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[92vw] sm:w-[90vw] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Held Carts</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="space-y-3">
            {holds.length === 0 && (
              <div className="text-sm text-gray-600">No held carts.</div>
            )}
            {holds.map((h) => (
              <div key={h.id} className="p-3 border rounded-lg flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium truncate">Hold #{h.id}</div>
                    <Badge variant="secondary">{h.itemsCount} item{h.itemsCount !== 1 ? "s" : ""}</Badge>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {new Date(h.createdAt).toLocaleString()}
                    {h.note ? ` • ${h.note}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-sm font-semibold hidden sm:block">${h.total.toFixed(2)}</div>
                  <Button size="sm" onClick={() => onResume(h.id)}>Resume</Button>
                  <Button size="sm" variant="outline" className="text-red-600" onClick={() => onDelete(h.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};