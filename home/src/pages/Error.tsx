import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorPageProps {
  title?: string;
  message?: string;
  error?: Error | string;
  onRetry?: () => void;
  onGoHome?: () => void;
  fullScreen?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  error,
  onRetry,
  onGoHome,
  fullScreen = true,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-background'
    : 'flex items-center justify-center p-8';

  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div className={containerClasses}>
      <div className="mx-auto max-w-md text-center">
        {/* Error icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </div>

        {/* Error title */}
        <h1 className="mb-3 text-2xl font-bold text-foreground">{title}</h1>

        {/* Error message */}
        <p className="mb-6 text-base text-muted-foreground">{message}</p>

        {/* Error details (if available) */}
        {errorMessage && (
          <div className="mb-6 rounded-lg bg-destructive/5 p-4 text-left">
            <p className="text-sm font-medium text-destructive">
              Error Details:
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
              Try Again
            </button>
          )}

          {onGoHome && (
            <button
              onClick={onGoHome}
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Home className="-ml-1 mr-2 h-4 w-4" />
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
