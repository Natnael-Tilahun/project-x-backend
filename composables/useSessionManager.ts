export const useSessionManager = () => {
  const authStore = useAuthStore();

  // Generate a unique session ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Clear stale sessions
  const clearStaleSessions = () => {
    const activeSession = localStorage.getItem("active-session");
    if (activeSession) {
      try {
        const sessionData = JSON.parse(activeSession);
        const currentTime = Date.now();
        const sessionAge = currentTime - sessionData.timestamp;

        // If session is older than 5 minutes, remove it
        if (sessionAge > 5 * 60 * 1000) {
          localStorage.removeItem("active-session");
          console.log("Cleared stale session");
          return true;
        }
      } catch (error) {
        console.error("Error parsing session data:", error);
        localStorage.removeItem("active-session");
        return true;
      }
    }
    return false;
  };

  // Check if another session is active
  const isAnotherSessionActive = () => {
    // First, clear any stale sessions
    clearStaleSessions();

    const activeSession = localStorage.getItem("active-session");
    if (!activeSession) return false;

    try {
      const sessionData = JSON.parse(activeSession);
      const currentTime = Date.now();
      const sessionAge = currentTime - sessionData.timestamp;

      // If session is older than 5 minutes, consider it stale and remove it
      if (sessionAge > 5 * 60 * 1000) {
        localStorage.removeItem("active-session");
        return false;
      }

      // If we have a valid session, it means another session is active
      // (since this function is called to check for conflicts)
      return true;
    } catch (error) {
      console.error("Error parsing session data:", error);
      localStorage.removeItem("active-session");
      return false;
    }
  };

  // Claim session for current tab
  const claimSession = () => {
    // Clear any existing stale sessions first
    clearStaleSessions();

    const sessionId = generateSessionId();
    const sessionData = {
      sessionId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };
    localStorage.setItem("active-session", JSON.stringify(sessionData));
    return sessionId;
  };

  // Release session
  const releaseSession = () => {
    localStorage.removeItem("active-session");
  };

  // Notify other tabs about login
  const notifyLogin = (sessionId: string) => {
    const loginEvent = {
      action: "login",
      sessionId,
      timestamp: Date.now(),
    };
    localStorage.setItem("auth-event", JSON.stringify(loginEvent));
  };

  // Notify other tabs about logout
  const notifyLogout = () => {
    const logoutEvent = {
      action: "logout",
      timestamp: Date.now(),
    };
    localStorage.setItem("auth-event", JSON.stringify(logoutEvent));
  };

  // Force logout all other tabs
  const forceLogoutOtherTabs = (sessionId: string) => {
    const logoutEvent = {
      action: "force_logout",
      sessionId,
      timestamp: Date.now(),
    };
    localStorage.setItem("auth-event", JSON.stringify(logoutEvent));
  };

  // Handle session conflicts
  const handleSessionConflict = () => {
    authStore.$reset();
    window.location.href = "/login?error=multiple_sessions";
  };

  // Handle session termination
  const handleSessionTermination = () => {
    authStore.$reset();
    window.location.href = "/login?error=session_terminated";
  };

  return {
    generateSessionId,
    isAnotherSessionActive,
    claimSession,
    releaseSession,
    notifyLogin,
    notifyLogout,
    forceLogoutOtherTabs,
    handleSessionConflict,
    handleSessionTermination,
    clearStaleSessions,
  };
};
