import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ScanLine, Plus } from "lucide-react";

export type POSProduct = {
  id: string;
  name: string;
  price: number;
  ndc: string;
  category?: string;
  stock?: number;
  image?: string;
};

interface ModernPosSearchProps {
  products: POSProduct[];
  onAdd: (product: POSProduct) => void;
  searchRef?: React.RefObject<HTMLInputElement>;
}

export const ModernPosSearch = ({ products, onAdd, searchRef }: ModernPosSearchProps) => {
  const [query, setQuery] = useState("");
  const [recentScans, setRecentScans] = useState<POSProduct[]>([]);

  const filtered = query.trim() 
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.ndc.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12)
    : products.slice(0, 12);

  const handleAdd = (product: POSProduct) => {
    onAdd(product);
    setRecentScans(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 6);
    });
    setQuery("");
    searchRef?.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filtered.length > 0) {
      handleAdd(filtered[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barcode Scanner */}
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <ScanLine className="h-6 w-6 text-blue-600" />
            <div className="flex-1">
              <Input
                ref={searchRef}
                placeholder="Scan barcode or search medicine..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-lg h-12 border-0 bg-white shadow-sm"
                autoFocus
              />
            </div>
            <Button size="lg" className="h-12 px-6">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Scans */}
      {recentScans.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recentScans.map(product => (
              <Button
                key={product.id}
                variant="outline"
                className="flex-shrink-0 h-auto p-3 flex flex-col items-start"
                onClick={() => handleAdd(product)}
              >
                <div className="font-medium text-sm">{product.name}</div>
                <div className="text-xs text-gray-500">${product.price}</div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(product => (
          <Card key={product.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => handleAdd(product)}>
            <CardContent className="p-3">
              <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                <div className="text-2xl">💊</div>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm leading-tight">{product.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">${product.price}</span>
                  <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {product.stock && (
                  <Badge variant={product.stock < 10 ? "destructive" : "secondary"} className="text-xs">
                    {product.stock} left
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};