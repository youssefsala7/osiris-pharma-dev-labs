import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  color?: "blue" | "green" | "red" | "yellow" | "purple";
}

export const ProgressBar = ({ 
  value, 
  max, 
  className = "", 
  showLabel = false,
  color = "blue" 
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
    <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", className)}>
      <motion.div
        className={cn("h-full rounded-full", colorClasses[color])}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {showLabel && (
        <div className="text-xs text-center mt-1">
          {percentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
};