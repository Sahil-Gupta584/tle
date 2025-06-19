import React from "react";
import { ThemeToggle } from "./themeToggle";

export default function Header({
  leftElement,
}: {
  leftElement: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {leftElement}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
