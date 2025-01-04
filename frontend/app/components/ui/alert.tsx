import React from 'react';
import { AlertCircle, X, CheckCircle, Info } from 'lucide-react';

type AlertVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

interface AlertProps {
  children?: React.ReactNode;
  title?: string;
  variant?: AlertVariant;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles = {
  default: {
    container: 'bg-gray-100 border-gray-200 text-gray-800',
    icon: <AlertCircle className="h-4 w-4 text-gray-600" />,
  },
  destructive: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: <AlertCircle className="h-4 w-4 text-red-600" />,
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <Info className="h-4 w-4 text-blue-600" />,
  },
};

export function Alert({
  children,
  title,
  variant = 'default',
  onDismiss,
  className = '',
}: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={`relative rounded-lg border p-4 ${styles.container} ${className}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>

        <div className="ml-3 flex-grow">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 hover:opacity-75 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function AlertTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`font-medium mb-1 ${className}`}>
      {children}
    </h3>
  );
}

export function AlertDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );
}

export default Alert;