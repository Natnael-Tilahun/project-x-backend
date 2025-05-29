import { useAuth } from './useAuth';

export const useInactivityTimer = (timeoutMinutes: number = 30) => {
  const { logout } = useAuth();
  let inactivityTimer: NodeJS.Timeout | null = null;
  const timeoutMs = timeoutMinutes * 60 * 1000;

  const resetTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    inactivityTimer = setTimeout(() => {
      logout();
    }, timeoutMs);
  };

  const setupInactivityTimer = () => {
    // Events to track user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown'
    ];

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup function
    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  };

  return {
    setupInactivityTimer
  };
}; 