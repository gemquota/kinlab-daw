import { Outlet } from "react-router-dom";

/**
 * Minimal transparent shell — the canvas IS the app.
 * No sidebar, no toolbar, no status bar.
 * All controls float over the fullscreen visual canvas.
 */
export function AppShell() {
  return (
    <div className="h-dvh w-screen bg-black overflow-hidden">
      <Outlet />
    </div>
  );
}
