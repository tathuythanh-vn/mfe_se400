import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  fullScreen = true,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-background'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <Loader2 className="h-16 w-16 animate-spin text-primary" />

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-medium text-foreground">{message}</p>
          {/* Animated dots */}
          <div className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]"></span>
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]"></span>
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
