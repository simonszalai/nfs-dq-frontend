import React from "react";

interface BenchmarkData {
  key: string;
  value: number;
}

interface BenchmarkChartProps {
  data: BenchmarkData[];
}

export function BenchmarkChart({ data }: BenchmarkChartProps) {
  const getColorClass = (value: number, index: number) => {
    if (value < 25) {
      return {
        text: "text-red-500 dark:text-red-400",
        gradient: "from-red-500 to-red-400 dark:from-red-600 dark:to-red-500",
      };
    } else if (value < 75) {
      return {
        text: "text-orange-500 dark:text-orange-400",
        gradient:
          "from-orange-500 to-orange-400 dark:from-orange-600 dark:to-orange-500",
      };
    } else {
      return {
        text: "text-green-500 dark:text-green-400",
        gradient:
          "from-green-500 to-green-400 dark:from-green-600 dark:to-green-500",
      };
    }
  };

  return (
    <div className="w-full h-full grid gap-4 py-4">
      {data.map((d, index) => {
        const colors = getColorClass(d.value, index);
        return (
          <React.Fragment key={d.key}>
            <div className={`text-sm whitespace-nowrap ${colors.text}`}>
              {d.key}
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative rounded-sm h-3 bg-gray-200 dark:bg-zinc-800 overflow-hidden w-full">
                <div
                  className={`absolute inset-0 rounded-r-sm bg-gradient-to-r ${colors.gradient}`}
                  style={{
                    width: `${d.value}%`,
                  }}
                />
              </div>
              <div
                className={`text-sm whitespace-nowrap ${colors.text} tabular-nums`}
              >
                {d.value}%
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
