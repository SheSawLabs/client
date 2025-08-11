import React from "react";
import { AlertTriangle } from "lucide-react";

interface SafetyQuoteProps {
  message: string;
  className?: string;
}

export const SafetyQuote: React.FC<SafetyQuoteProps> = ({
  message,
  className = "",
}) => {
  return (
    <div
      className={`flex items-start gap-2 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400 ${className}`}
    >
      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-orange-800">{message}</p>
    </div>
  );
};
