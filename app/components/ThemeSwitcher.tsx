"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full opacity-50" />;
  }

  const toggleTheme = () => {
    // If it looks dark (whether system or manual), switch to light.
    // Otherwise, switch to dark.
    const isDark = resolvedTheme === "dark";
    setTheme(isDark ? "light" : "dark");
  };

  // Determine if currently visual state is dark for the icon
  const isVisualDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
      title={isVisualDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isVisualDark ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-blue-600" />
      )}
    </button>
  );
}