/**
 * Loading spinner component for lazy-loaded routes.
 * Displays a centered spinner with optional message.
 */
export function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-full bg-surface-primary">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
    </div>
  );
}
