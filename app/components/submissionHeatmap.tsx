import { Problem } from "@/app/lib/schema";
import HeatMap from "@uiw/react-heat-map";
import { useTheme } from "next-themes";
import React from "react";

interface SubmissionHeatmapProps {
  problems: Problem[];
  problemFilterDay: number;
}

export const SubmissionHeatmap: React.FC<SubmissionHeatmapProps> = ({
  problems,
  problemFilterDay,
}) => {
  const { theme } = useTheme();
  const value = problems.map((p) => {
    const date = new Date(p.creationTimeSeconds * 1000);

    const dayProblems = problems.filter((p) => {
      const problemDate = new Date(p.creationTimeSeconds * 1000);
      return date.toString() === problemDate.toString();
    }).length;

    return {
      date: `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`,
      count: dayProblems,
    };
  });
  const isDark = theme === "dark";
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (problemFilterDay + 30));

  return (
    <div>
      <HeatMap
        value={value}
        className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg transition-colors duration-300 !text-gray-500 !dark:text-gray-400"
        startDate={startDate}
        width={500}
        rectSize={14}
        panelColors={{
          0: isDark ? "#374151" : "#c5c5c5", // very dark gray
          1: isDark ? "#065f46" : "#bbf7d0", // dark green
          3: isDark ? "#059669" : "#4ade80",
          5: isDark ? "#10b981" : "#16a34a", // lighter green
          7: isDark ? "#059669" : "#15803d", // even lighter
        }}
        rectProps={{ rx: 2 }}
      />
    </div>
  );
};
