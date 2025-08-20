import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StandardCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerAction?: React.ReactNode;
  variant?: "default" | "compact" | "tall";
}

export const StandardCard: React.FC<StandardCardProps> = ({
  title,
  children,
  className,
  contentClassName,
  headerAction,
  variant = "default"
}) => {
  const variantClasses = {
    default: "min-h-[200px]",
    compact: "min-h-[120px]",
    tall: "min-h-[300px]"
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300", variantClasses[variant], className)}>
      {title && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {headerAction}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn("p-6", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};