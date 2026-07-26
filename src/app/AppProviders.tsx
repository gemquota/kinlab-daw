import { useEffect, type ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { useThemeStore } from "@/store";

interface AppProvidersProps {
  children: ReactNode;
}

function ThemeInitializer({ children }: { children: ReactNode }) {
  const { initSystemTheme } = useThemeStore();

  useEffect(() => {
    initSystemTheme();
  }, [initSystemTheme]);

  return <>{children}</>;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeInitializer>
        {children}
      </ThemeInitializer>
    </ErrorBoundary>
  );
}
