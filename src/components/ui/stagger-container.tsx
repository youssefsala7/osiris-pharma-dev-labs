import { cn } from "@/lib/utils";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer = ({ 
  children, 
  className, 
  staggerDelay = 100 
}: StaggerContainerProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
};