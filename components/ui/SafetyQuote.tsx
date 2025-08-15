import React from "react";
import { AlertTriangle } from "lucide-react";
import { COLORS } from "@/constants";

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
      className={`flex items-start gap-2 p-3 bg-red-50 rounded-lg border-l-4 ${className}`}
      style={{ borderLeftColor: COLORS.RED_500 }}
    >
      <AlertTriangle
        className="w-4 h-4 mt-0.5 flex-shrink-0"
        style={{ color: COLORS.RED_500 }}
      />
      <p className="text-sm leading-1" style={{ color: COLORS.GRAY_800 }}>
        {message}
      </p>
    </div>
  );
};
