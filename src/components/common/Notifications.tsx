import { useState, useCallback, createContext, useContext, type ReactNode } from "react";
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type NotificationType = "success" | "warning" | "error" | "info";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextValue {
  notify: (type: NotificationType, message: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const ICONS: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

const STYLES: Record<NotificationType, string> = {
  success: "bg-derivative-velocity-500/10 border-derivative-velocity-500/30 text-derivative-velocity-500",
  warning: "bg-derivative-lock-500/10 border-derivative-lock-500/30 text-derivative-lock-500",
  error: "bg-derivative-jerk-500/10 border-derivative-jerk-500/30 text-derivative-jerk-500",
  info: "bg-derivative-position-500/10 border-derivative-position-500/30 text-derivative-position-500",
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (type: NotificationType, message: string, duration = 5000) => {
      const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setNotifications((prev) => [...prev, { id, type, message, duration }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss],
  );

  return (
    <NotificationContext.Provider value={{ notify, dismiss }}>
      {children}
      {/* Notification Stack */}
      <div className="fixed bottom-12 right-4 z-notification flex flex-col gap-2 pointer-events-none">
        {notifications.map((n) => {
          const Icon = ICONS[n.type];
          return (
            <div
              key={n.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg pointer-events-auto animate-slide-in-right",
                STYLES[n.type],
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-caption text-text-primary">{n.message}</span>
              <button
                onClick={() => dismiss(n.id)}
                className="ml-2 p-0.5 rounded hover:bg-black/10 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
