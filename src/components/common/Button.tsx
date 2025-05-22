import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  color: string;
  children: React.ReactNode;
}

export function Button({ onClick, loading, disabled, color, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full ${color} text-white py-2 rounded-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Analyzing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}