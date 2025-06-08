import type { CSSProperties } from "react";

interface IssueSeverityData {
  key: string;
  value: number;
  color: string;
}

interface IssueSeverityBarProps {
  issueStats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
}

export function IssueSeverityBar({ issueStats }: IssueSeverityBarProps) {
  const data: IssueSeverityData[] = [
    {
      key: "Critical",
      value: issueStats.critical,
      color: "from-red-400/80 to-red-500/80 dark:from-red-500 dark:to-red-700",
    },
    {
      key: "High",
      value: issueStats.high,
      color:
        "from-orange-400/80 to-orange-500/80 dark:from-orange-500 dark:to-orange-700",
    },
    {
      key: "Medium",
      value: issueStats.medium,
      color:
        "from-yellow-400/80 to-yellow-500/80 dark:from-yellow-500 dark:to-yellow-700",
    },
    {
      key: "Low",
      value: issueStats.low,
      color:
        "from-blue-400/80 to-blue-500/80 dark:from-blue-500 dark:to-blue-700",
    },
  ].filter((item) => item.value > 0); // Only show severities with issues

  if (data.length === 0) {
    return (
      <div className="text-gray-400 text-sm text-center py-4">
        No issues found
      </div>
    );
  }

  const gap = 0.3; // gap between bars
  const totalValue = data.reduce((acc, d) => acc + d.value, 0);
  const barHeight = 54;
  const totalWidth = totalValue + gap * (data.length - 1);
  let cumulativeWidth = 0;

  const cornerRadius = 4; // Adjust this value to change the roundness

  return (
    <div
      className="relative h-[var(--height)] mb-1.5"
      style={
        {
          "--marginTop": "0px",
          "--marginRight": "0px",
          "--marginBottom": "0px",
          "--marginLeft": "0px",
          "--height": `${barHeight}px`,
        } as CSSProperties
      }
    >
      {/* Chart Area */}
      <div
        className="absolute inset-0 
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        {/* Bars with Gradient Fill */}
        {data.map((d, index) => {
          const barWidth = (d.value / totalWidth) * 100;
          const xPosition = cumulativeWidth;
          cumulativeWidth += barWidth + gap;

          return (
            <div
              key={index}
              className="relative"
              style={{
                width: `${barWidth}%`,
                height: `${barHeight}px`,
                left: `${xPosition}%`,
                position: "absolute",
              }}
            >
              <div
                className={`bg-gradient-to-b ${d.color}`}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: `${cornerRadius}px`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: `${barHeight / 5}px`,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {d.key}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: `${barHeight / 2}px`,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontFamily: "monospace",
                }}
              >
                {d.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
