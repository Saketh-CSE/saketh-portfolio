import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const ThemeContext = createContext(null);

function getInitialTheme() {
  try { return localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light'; }
  catch { return 'light'; }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [transition, setTransition] = useState(null);
  const transitionRef = useRef(null);
  const transitionIdRef = useRef(0);
  const transitionTimerRef = useRef(null);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (transition) document.documentElement.dataset.themeTransitioning = 'true';
    else delete document.documentElement.dataset.themeTransitioning;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === 'dark' ? '#101514' : '#f4f0e6';
  }, [theme, transition]);

  useEffect(() => {
    try { localStorage.setItem('portfolio-theme', theme); } catch { /* Theme remains active for this visit. */ }
  }, [theme]);

  useEffect(() => () => {
    window.clearTimeout(transitionTimerRef.current);
    delete document.documentElement.dataset.themeTransitioning;
  }, []);

  const finishThemeTransition = useCallback((id) => {
    if (transitionRef.current?.id !== id) return;
    window.clearTimeout(transitionTimerRef.current);
    transitionRef.current = null;
    transitionTimerRef.current = null;
    setTransition(null);
  }, []);

  const toggleTheme = useCallback((event) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduceMotion) {
      finishThemeTransition(transitionRef.current?.id);
      return;
    }

    const bounds = event?.currentTarget?.getBoundingClientRect?.();
    const id = ++transitionIdRef.current;
    const nextTransition = {
      id,
      from: theme,
      to: nextTheme,
      x: bounds ? bounds.left + bounds.width / 2 : window.innerWidth / 2,
      y: bounds ? bounds.top + bounds.height / 2 : window.innerHeight / 2,
    };
    transitionRef.current = nextTransition;
    setTransition(nextTransition);
    window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = window.setTimeout(() => finishThemeTransition(id), 1150);
  }, [finishThemeTransition, theme]);

  const value = useMemo(() => ({ theme, toggleTheme, transition, finishThemeTransition }), [finishThemeTransition, theme, toggleTheme, transition]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
