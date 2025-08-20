import { cn } from "@/lib/utils";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({
  title,
  subtitle,
  headerActions,
  children,
  className
}: PageContainerProps) => {
  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
            )}
          </div>
          {headerActions && (
            <div className="flex flex-col sm:flex-row gap-2">
              {headerActions}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};