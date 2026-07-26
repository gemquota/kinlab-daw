import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopToolbar } from "@/components/layout/TopToolbar";
import { InspectorPanel } from "@/components/layout/InspectorPanel";
import { StatusBar } from "@/components/layout/StatusBar";
import { NotificationProvider } from "@/components/common/Notifications";
import { HelpModal } from "@/components/common/HelpModal";
import { useUIStore } from "@/store";

/**
 * Root layout — mobile-first responsive shell.
 * On mobile: sidebar is an overlay, inspector is hidden by default.
 * On desktop (md+): sidebar is persistent, inspector is visible.
 */
export function AppShell() {
  const { sidebarOpen, setSidebarOpen, inspectorOpen, setInspectorOpen } = useUIStore();

  return (
    <NotificationProvider>
      <HelpModal />
      <div className="flex flex-col h-dvh w-screen bg-surface-primary text-text-primary overflow-hidden">
        <TopToolbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onInspectorToggle={() => setInspectorOpen(!inspectorOpen)}
        />

        <div className="flex flex-1 min-h-0 relative">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
              fixed top-[var(--toolbar-height)] bottom-0 left-0 z-50
              md:static md:z-auto
              transition-transform duration-200 ease-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Main content */}
          <main
            role="main"
            aria-label="Main workspace"
            className="flex-1 min-w-0 overflow-y-auto"
          >
            <Outlet />
          </main>

          {/* Inspector — hidden on mobile, toggleable */}
          {inspectorOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/40 z-40 md:hidden"
                onClick={() => setInspectorOpen(false)}
              />
              <div className="fixed top-[var(--toolbar-height)] bottom-0 right-0 z-50 md:static md:z-auto">
                <InspectorPanel onClose={() => setInspectorOpen(false)} />
              </div>
            </>
          )}
        </div>

        <StatusBar />
      </div>
    </NotificationProvider>
  );
}
