import * as React from "react";
import { Switch } from "./switch";
import { Label } from "./label";

interface EnhancedSwitchProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const EnhancedSwitch: React.FC<EnhancedSwitchProps> = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex flex-col">
        <Label htmlFor={id} className="font-medium text-gray-900 dark:text-gray-100">
          {label}
        </Label>
        {description && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={`transition-colors duration-200 ${
          checked
            ? "bg-blue-600 border-blue-600"
            : "bg-gray-200 border-gray-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
    </div>
  );
};