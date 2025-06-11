import { useAuth } from './useAuth';
import { toast } from "~/components/ui/toast";

export const useInactivityTimer = (timeoutMinutes: number = 30) => {
  const { logout } = useAuth();
  let inactivityTimer: NodeJS.Timeout | null = null;
  const timeoutMs = timeoutMinutes * 60 * 1000;

  const resetTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    inactivityTimer = setTimeout(() => {
      toast({
        title: "Session timeout due to user inactivity.",
        description: "Please login again.",
        variant: "destructive"
      });
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