import type { FallbackProps } from "react-error-boundary";

/**
 * Error fallback UI component for React ErrorBoundary.
 * Displays error message and provides reset functionality.
 * 
 * Task 3.3.2: Error fallback UI component
 */
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex items-center justify-center h-full bg-surface-primary">
      <div className="text-center p-8 max-w-md">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
