import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
  variant?: "default" | "destructive" | "secondary";
  size?: "sm" | "md" | "lg";
}

export const NotificationBadge = ({ 
  count, 
  max = 99, 
  className = "",
  variant = "destructive",
  size = "md"
}: NotificationBadgeProps) => {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  const sizeClasses = {
    sm: "h-4 w-4 text-xs",
    md: "h-5 w-5 text-xs",
    lg: "h-6 w-6 text-sm"
  };

  const variantClasses = {
    default: "bg-blue-500 text-white",
    destructive: "bg-red-500 text-white",
    secondary: "bg-gray-500 text-white"
  };

  return (
    <div className={cn(
      "absolute -top-1 -right-1 rounded-full flex items-center justify-center font-medium animate-pulse",
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      {displayCount}
    </div>
  );
};