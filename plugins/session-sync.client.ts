// plugins/session-sync.client.ts

export default defineNuxtPlugin(() => {
    // Listen for the 'storage' event on the window
    window.addEventListener('storage', (event) => {
      // We only care about our specific key
      if (event.key === 'auth-event') {
        window.location.reload();
      }
    });
  });