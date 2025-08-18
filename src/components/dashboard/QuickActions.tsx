import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { QuickAction } from "./types";

interface QuickActionsProps {
  actions: QuickAction[];
  delay?: number;
}

export const QuickActions = ({ actions, delay = 0 }: QuickActionsProps) => {
  return (
    <FadeIn delay={delay}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-16 sm:h-20 flex flex-col items-center justify-center transition-all duration-200 ${action.color}`}
                  onClick={action.action}
                >
                  <Icon className="h-4 w-4 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
};