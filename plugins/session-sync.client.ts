// plugins/session-sync.client.ts

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const sessionManager = useSessionManager();

  let currentSessionId: string | null = null;

  // Check for active session on page load
  if (authStore.isAuthenticated) {
    if (sessionManager.isAnotherSessionActive()) {
      sessionManager.handleSessionConflict();
      return;
    } else {
      // Claim the session
      currentSessionId = sessionManager.claimSession();
    }
  }

  // Listen for storage events (other tabs logging in/out)
  window.addEventListener("storage", (event) => {
    if (event.key === "auth-event") {
      const eventData = event.newValue;
      if (eventData) {
        try {
          const parsedData = JSON.parse(eventData);

          if (parsedData.action === "login") {
            // Another tab logged in, check if we should log out
            if (parsedData.sessionId !== currentSessionId) {
              sessionManager.handleSessionConflict();
            }
          } else if (parsedData.action === "logout") {
            // Another tab logged out, release our session claim
            sessionManager.releaseSession();
          } else if (parsedData.action === "force_logout") {
            // Force logout from another tab
            if (parsedData.sessionId !== currentSessionId) {
              sessionManager.handleSessionTermination();
            }
          }
        } catch (error) {
          console.error("Error parsing auth event:", error);
        }
      }
    } else if (event.key === "active-session") {
      // Active session changed
      if (
        authStore.isAuthenticated &&
        sessionManager.isAnotherSessionActive()
      ) {
        sessionManager.handleSessionConflict();
      }
    }
  });

  // Listen for page unload to release session
  window.addEventListener("beforeunload", () => {
    sessionManager.releaseSession();
  });

  // Listen for page visibility change
  // document.addEventListener("visibilitychange", () => {
  //   if (document.hidden && authStore.isAuthenticated) {
  //     // Page is hidden, check if another session took over
  //     setTimeout(() => {
  //       if (sessionManager.isAnotherSessionActive()) {
  //         sessionManager.handleSessionConflict();
  //       }
  //     }, 1000);
  //   }
  // });

  // Periodic session validation (every 30 seconds)
  let sessionValidationInterval: NodeJS.Timeout | null = null;

  const startSessionValidation = () => {
    if (sessionValidationInterval) {
      clearInterval(sessionValidationInterval);
    }

    sessionValidationInterval = setInterval(() => {
      if (authStore.isAuthenticated) {
        // Only check for conflicts if we don't have a current session
        // or if there's actually another session active
        const activeSession = localStorage.getItem("active-session");
        if (activeSession) {
          try {
            const sessionData = JSON.parse(activeSession);
            const currentTime = Date.now();
            const sessionAge = currentTime - sessionData.timestamp;

            // If session is stale, clean it up
            if (sessionAge > 10 * 60 * 1000) {
              localStorage.removeItem("active-session");
              return;
            }

            // If this is not our session, handle conflict
            if (sessionData.sessionId !== currentSessionId) {
              sessionManager.handleSessionConflict();
            }
          } catch (error) {
            console.error("Error validating session:", error);
            localStorage.removeItem("active-session");
          }
        }
      }
    }, 30000);
  };

  const stopSessionValidation = () => {
    if (sessionValidationInterval) {
      clearInterval(sessionValidationInterval);
      sessionValidationInterval = null;
    }
  };

  // Start validation when authenticated
  watch(
    () => authStore.isAuthenticated,
    (isAuthenticated) => {
      if (isAuthenticated) {
        startSessionValidation();
      } else {
        stopSessionValidation();
      }
    },
    { immediate: true }
  );

  // Cleanup on unmount
  onUnmounted(() => {
    stopSessionValidation();
    sessionManager.releaseSession();
  });

  // Provide session management functions to other components
  return {
    provide: {
      claimSession: () => {
        currentSessionId = sessionManager.claimSession();
        return currentSessionId;
      },
      releaseSession: sessionManager.releaseSession,
      notifyLogin: (sessionId: string) => sessionManager.notifyLogin(sessionId),
      notifyLogout: sessionManager.notifyLogout,
      forceLogoutOtherTabs: (sessionId: string) =>
        sessionManager.forceLogoutOtherTabs(sessionId),
      clearStaleSessions: sessionManager.clearStaleSessions,
    },
  };
});
