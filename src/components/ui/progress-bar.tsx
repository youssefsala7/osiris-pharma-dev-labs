import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export const ProgressBar = ({ 
  value, 
  max = 100, 
  className = "",
  showLabel = false,
  animated = true
}: ProgressBarProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(percentage);
    }
  }, [percentage, animated]);

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${animatedValue}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};