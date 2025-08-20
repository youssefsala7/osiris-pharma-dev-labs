import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  title,
  subtitle,
  headerActions
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={cn("p-6 space-y-6", className)}>
        {(title || headerActions) && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {title && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>
            )}
            {headerActions && (
              <div className="flex flex-col sm:flex-row gap-3">
                {headerActions}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};