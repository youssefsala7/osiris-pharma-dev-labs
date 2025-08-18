import { ReactNode } from "react";
import { FadeIn } from "./fade-in";

interface StaggerContainerProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer = ({ children, staggerDelay = 100, className }: StaggerContainerProps) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn key={index} delay={index * staggerDelay}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
};