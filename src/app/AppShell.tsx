import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/common/ErrorFallback";

/**
 * Minimal transparent shell — the canvas IS the app.
 * No sidebar, no toolbar, no status bar.
 * All controls float over the fullscreen visual canvas.
 * 
 * Task 3.3.1: Wraps children with ErrorBoundary
 */
export function AppShell() {
  return (
    <div className="h-dvh w-screen bg-black overflow-hidden">
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // Reset any state if needed
          window.location.reload();
        }}
      >
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
