import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type CursorVariant = 'default' | 'hover' | 'view' | 'drag' | 'magnetic' | 'text' | 'hidden';

export interface CursorState {
  variant: CursorVariant;
  label?: string;
}

interface CursorContextType {
  cursor: CursorState;
  setCursor: (variant: CursorVariant, label?: string) => void;
  resetCursor: () => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursor, setCursorState] = useState<CursorState>({
    variant: 'default',
  });

  const setCursor = useCallback((variant: CursorVariant, label?: string) => {
    setCursorState({ variant, label });
  }, []);

  const resetCursor = useCallback(() => {
    setCursorState({ variant: 'default' });
  }, []);

  const value = useMemo(
    () => ({ cursor, setCursor, resetCursor }),
    [cursor, setCursor, resetCursor]
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
}

