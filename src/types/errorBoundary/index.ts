import { ErrorInfo, ReactNode } from 'react';

export type TErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export type TErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
};
