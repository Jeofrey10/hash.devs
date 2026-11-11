import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

export type PreloaderStatus =
  | 'INITIALIZING EXPERIENCE'
  | 'LOADING CRITICAL FONTS'
  | 'LOADING BRAND ASSETS'
  | 'PREPARING 3D ENVIRONMENT'
  | 'INITIALIZING INTERACTIONS'
  | 'FINALIZING EXPERIENCE'
  | 'EXPERIENCE READY';

interface PreloaderContextValue {
  progress: number;
  status: PreloaderStatus;
  isComplete: boolean;
  isDismissed: boolean;
  dismissPreloader: () => void;
  registerThreeJsReady: () => void;
  markReady: () => void;
}

const PreloaderContext = createContext<PreloaderContextValue | null>(null);

const STORAGE_KEY = 'hashdevs_initial_preload_done';

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  // Check if session has already undergone the initial preloader
  const isInitialEntry = typeof window !== 'undefined' ? !sessionStorage.getItem(STORAGE_KEY) : true;

  const [progress, setProgress] = useState(isInitialEntry ? 0 : 100);
  const [status, setStatus] = useState<PreloaderStatus>(
    isInitialEntry ? 'INITIALIZING EXPERIENCE' : 'EXPERIENCE READY'
  );
  const [isComplete, setIsComplete] = useState(!isInitialEntry);
  const [isDismissed, setIsDismissed] = useState(!isInitialEntry);

  const threeJsReadyRef = useRef(!isInitialEntry);
  const markReadyCalledRef = useRef(false);

  const dismissPreloader = useCallback(() => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }
  }, []);

  const registerThreeJsReady = useCallback(() => {
    threeJsReadyRef.current = true;
  }, []);

  const markReady = useCallback(() => {
    if (markReadyCalledRef.current) return;
    markReadyCalledRef.current = true;
    setProgress(100);
    setStatus('EXPERIENCE READY');
    setIsComplete(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }
  }, []);

  useEffect(() => {
    if (!isInitialEntry) {
      return;
    }

    let isMounted = true;
    const MAX_TIMEOUT_MS = 3800; // Hard timeout safety net to guarantee site never hangs

    // Helper to safely step progress forward
    const updateProgress = (targetProgress: number, targetStatus: PreloaderStatus) => {
      if (!isMounted) return;
      setProgress((prev) => Math.max(prev, targetProgress));
      setStatus(targetStatus);
    };

    // Task 1: Check document DOM readiness
    const checkDomReady = () => {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        window.addEventListener('DOMContentLoaded', resolve, { once: true });
      });
    };

    // Task 2: Check Critical Web Fonts (Syne, Manrope, Space Mono)
    const checkFontsReady = async () => {
      if ('fonts' in document) {
        try {
          await Promise.race([
            Promise.all([
              document.fonts.load('800 16px Syne'),
              document.fonts.load('400 16px Manrope'),
              document.fonts.load('500 16px "Space Mono"'),
            ]),
            new Promise((r) => setTimeout(r, 1200)),
          ]);
        } catch {
          // Non-critical fallback
        }
      }
    };

    // Task 3: Check Essential Brand Images (logo & emblem)
    const checkImagesReady = () => {
      const essentialImages = ['/images/hashdevs-logo.png', '/images/hashdevs-emblem.png'];
      const promises = essentialImages.map((src) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Graceful: never block on image failure
          }
        });
      });
      return Promise.race([Promise.all(promises), new Promise((r) => setTimeout(r, 1000))]);
    };

    // Task 4: Check Three.js / Hero readiness if on homepage
    const checkThreeReady = () => {
      // If direct route is not homepage (/), don't hold preloader waiting for homepage hero
      const isHome = window.location.pathname === '/' || window.location.pathname === '';
      if (!isHome) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (threeJsReadyRef.current) {
            clearInterval(interval);
            resolve();
          }
        }, 50);

        // Max wait for 3D is 1800ms
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 1800);
      });
    };

    // Orchestrated progressive real-load sequence
    const runLoadingPipeline = async () => {
      updateProgress(15, 'INITIALIZING EXPERIENCE');
      await checkDomReady();

      updateProgress(35, 'LOADING CRITICAL FONTS');
      await checkFontsReady();

      updateProgress(65, 'LOADING BRAND ASSETS');
      await checkImagesReady();

      updateProgress(85, 'PREPARING 3D ENVIRONMENT');
      await checkThreeReady();

      updateProgress(95, 'INITIALIZING INTERACTIONS');
      await new Promise((r) => setTimeout(r, 200));

      // Final completion
      updateProgress(100, 'EXPERIENCE READY');
      setIsComplete(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      }
    };

    // Run pipeline with hard safety timeout
    const hardTimeoutTimer = setTimeout(() => {
      if (!markReadyCalledRef.current && isMounted) {
        updateProgress(100, 'EXPERIENCE READY');
        setIsComplete(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(STORAGE_KEY, 'true');
        }
      }
    }, MAX_TIMEOUT_MS);

    runLoadingPipeline().catch(() => {
      if (isMounted) {
        updateProgress(100, 'EXPERIENCE READY');
        setIsComplete(true);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(hardTimeoutTimer);
    };
  }, [isInitialEntry]);

  return (
    <PreloaderContext.Provider
      value={{
        progress,
        status,
        isComplete,
        isDismissed,
        dismissPreloader,
        registerThreeJsReady,
        markReady,
      }}
    >
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  const context = useContext(PreloaderContext);
  if (!context) {
    throw new Error('usePreloader must be used within a PreloaderProvider');
  }
  return context;
}
