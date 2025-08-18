import React from "react";
import { cn } from "@/lib/utils";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className,
  staggerDelay = 100
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{
            animationDelay: `${index * staggerDelay}ms`,
            animationFillMode: "both"
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};