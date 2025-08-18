import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "offline" | "busy" | "away";
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export const StatusIndicator = ({ 
  status, 
  size = "md", 
  className = "",
  showLabel = false,
  label
}: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4"
  };

  const statusClasses = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-red-500",
    away: "bg-yellow-500"
  };

  const statusLabels = {
    online: "Online",
    offline: "Offline", 
    busy: "Busy",
    away: "Away"
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn(
        "rounded-full animate-pulse",
        sizeClasses[size],
        statusClasses[status]
      )} />
      {showLabel && (
        <span className="ml-2 text-sm text-gray-600">
          {label || statusLabels[status]}
        </span>
      )}
    </div>
  );
};