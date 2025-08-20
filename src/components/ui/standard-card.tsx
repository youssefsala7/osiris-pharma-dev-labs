import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StandardCardProps {
  title?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "compact";
}

export const StandardCard = ({
  title,
  headerAction,
  children,
  className,
  variant = "default"
}: StandardCardProps) => {
  return (
    <Card className={cn("hover:shadow-lg transition-shadow duration-200", className)}>
      {title && (
        <CardHeader className={cn(variant === "compact" && "pb-3")}>
          <div className="flex items-center justify-between">
            <CardTitle className={cn(variant === "compact" ? "text-lg" : "text-xl")}>
              {title}
            </CardTitle>
            {headerAction}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(variant === "compact" && "pt-0")}>
        {children}
      </CardContent>
    </Card>
  );
};