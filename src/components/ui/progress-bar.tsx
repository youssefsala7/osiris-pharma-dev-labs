import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: "blue" | "green" | "red" | "yellow" | "purple";
  showLabel?: boolean;
  isAnimated?: boolean;
}

export const ProgressBar = ({ 
  value, 
  max = 100, 
  className, 
  color = "blue", 
  showLabel = false,
  isAnimated = true 
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600", 
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600"
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            colorClasses[color],
            isAnimated && "animate-pulse"
          )}
          style={{ width: `${percentage}%` }}
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