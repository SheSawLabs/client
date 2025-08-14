import React from "react";

interface LineGraphProps {
  keyword: string;
  count: number;
  totalCount: number;
  className?: string;
}

export const LineGraph: React.FC<LineGraphProps> = ({
  keyword,
  count,
  totalCount,
  className = "",
}) => {
  const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;

  return (
    <div className={`flex items-center relative gap-y-1 ${className}`}>
      {/* 직선형 그래프 */}
      <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-100 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 키워드 */}
      <span className="absolute left-0 pl-4 text-xs text-gray-600 text-center">
        {keyword}
      </span>

      {/* 숫자 */}
      <span className="absolute right-0 pr-4 text-xs font-medium text-gray-900">
        {count}
      </span>
    </div>
  );
};
