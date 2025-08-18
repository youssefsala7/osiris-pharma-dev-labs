import React from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 500,
  className
}) => {
  return (
    <div
      className={cn("animate-in fade-in slide-in-from-bottom-4", className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: "both"
      }}
    >
      {children}
    </div>
  );
};