import React from "react";
import { MARKER_COLORS, type MarkerColorType } from "@/constants";

interface MarkerIconProps {
  color?: MarkerColorType;
  size?: number;
  className?: string;
}

export const MarkerIcon: React.FC<MarkerIconProps> = ({
  color = "DEFAULT",
  size = 96,
  className = "",
}) => {
  const fillColor = MARKER_COLORS[color];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_1_6)">
        <path
          d="M48 8C32.52 8 20 20.52 20 36C20 42.96 22 49.48 25.64 55.36C29.44 61.52 34.44 66.8 38.28 72.96C40.16 75.96 41.52 78.76 42.96 82C44 84.2 44.84 88 48 88C51.16 88 52 84.2 53 82C54.48 78.76 55.8 75.96 57.68 72.96C61.52 66.84 66.52 61.56 70.32 55.36C74 49.48 76 42.96 76 36C76 20.52 63.48 8 48 8ZM48 47C42.48 47 38 42.52 38 37C38 31.48 42.48 27 48 27C53.52 27 58 31.48 58 37C58 42.52 53.52 47 48 47Z"
          fill={fillColor}
        />
        <path
          d="M38 37C38 42.52 42.48 47 48 47C53.52 47 58 42.52 58 37C58 31.48 53.52 27 48 27C42.48 27 38 31.48 38 37Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_6">
          <rect width="96" height="96" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
