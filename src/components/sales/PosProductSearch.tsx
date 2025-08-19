import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, ScanLine } from "lucide-react";

export type POSProduct = {
  id: string;
  name: string;
  price: number;
  ndc: string;
  category?: string;
  stock?: number;
};

interface PosProductSearchProps {
  products: POSProduct[];
  onAdd: (product: POSProduct) => void;
  onScan: (code: string) => void;
  quickPicks?: POSProduct[];
  searchRef?: React.RefObject<HTMLInputElement>;
}

export const PosProductSearch = ({ products, onAdd, onScan, quickPicks = [], searchRef }: PosProductSearchProps) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 20);
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.ndc.toLowerCase().includes(q) ||
      (p.category ? p.category.toLowerCase().includes(q) : false),
    ).slice(0, 20);
  }, [products, query]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.category && set.add(p.category));
    return Array.from(set).slice(0, 8);
  }, [products]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const code = query.trim();
      if (!code) return;
      const exact = products.find(p => p.ndc.toLowerCase() === code.toLowerCase());
      if (exact) {
        onScan(code);
        setQuery("");
        return;
      }
      if (filtered.length > 0) {
        onAdd(filtered[0]);
        setQuery("");
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Find Medicine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              ref={searchRef}
              placeholder="Search by name, category, or NDC... (Press Enter to add)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button variant="outline" onClick={() => query && onScan(query)} className="shrink-0">
              <ScanLine className="h-4 w-4 mr-2" />
              Scan
            </Button>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="cursor-pointer px-3 py-1 rounded-full"
                  onClick={() => setQuery(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {quickPicks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Picks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {quickPicks.map(p => (
                <Button
                  key={p.id}
                  variant="outline"
                  className="justify-between"
                  onClick={() => onAdd(p)}
                >
                  <span className="truncate">{p.name}</span>
                  <span className="ml-2 text-xs font-medium">${p.price.toFixed(2)}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Results</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-80">
            <div className="divide-y">
              {filtered.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 hover:bg-gray-50">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-xs text-gray-500">
                      NDC: {p.ndc} {p.category ? `• ${p.category}` : ""} {typeof p.stock === "number" ? `• Stock: ${p.stock}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold">${p.price.toFixed(2)}</div>
                    <Button size="sm" variant="outline" onClick={() => onAdd(p)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="p-4 text-sm text-gray-500">No matches. Try another term or scan an NDC.</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};