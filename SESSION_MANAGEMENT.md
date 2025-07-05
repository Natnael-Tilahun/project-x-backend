# Session Management Solution

## Overview

This solution prevents multiple tabs and sessions from being active simultaneously for the same user. It uses a combination of localStorage-based session tracking and cross-tab communication to ensure only one active session per user.

## How It Works

### 1. Session Claiming

- When a user logs in, the system generates a unique session ID
- The session is "claimed" by storing it in localStorage with a timestamp
- Only one tab can claim the session at a time

### 2. Cross-Tab Communication

- Uses the `storage` event to communicate between tabs
- When one tab logs in, it notifies other tabs via localStorage
- Other tabs detect the login and automatically log out

### 3. Session Validation

- Periodic checks (every 30 seconds) to ensure session integrity
- Stale session cleanup (sessions older than 5 minutes are considered invalid)
- Page visibility change detection to handle tab switching

## Components

### 1. Session Manager Composable (`composables/useSessionManager.ts`)

Provides the core session management functions:

- `claimSession()` - Claims the session for the current tab
- `releaseSession()` - Releases the session
- `isAnotherSessionActive()` - Checks if another session is active
- `notifyLogin()` - Notifies other tabs about login
- `notifyLogout()` - Notifies other tabs about logout

### 2. Session Sync Plugin (`plugins/session-sync.client.ts`)

Handles the cross-tab communication and event listeners:

- Listens for storage events from other tabs
- Manages session validation intervals
- Handles page visibility changes
- Provides session management functions to components

### 3. Updated Components

- **LoginForm**: Claims session and notifies other tabs on login
- **UserNav**: Releases session and notifies other tabs on logout
- **useAuth**: Integrates session management with authentication

## Error Handling

The system provides clear error messages for different scenarios:

1. **Multiple Sessions Error**: When another session is already active

   - URL: `/login?error=multiple_sessions`
   - Message: "Another session is already active. Please close other tabs or log out from the other session."

2. **Session Terminated Error**: When session is terminated by another login
   - URL: `/login?error=session_terminated`
   - Message: "Your session was terminated by another login. Please log in again."

## Configuration

### Nuxt Configuration

The session-sync plugin is registered in `nuxt.config.ts`:

```typescript
plugins: ["~/plugins/fontawesome.ts", "~/plugins/session-sync.client.ts"];
```

### Session Timeout

- Session validation interval: 30 seconds
- Stale session timeout: 5 minutes
- Page visibility check delay: 1 second

## Usage

### In Components

```typescript
// Get session management functions
const { $claimSession, $releaseSession, $notifyLogin, $notifyLogout } =
  useNuxtApp();

// On login
const sessionId = $claimSession();
$notifyLogin(sessionId);

// On logout
$releaseSession();
$notifyLogout();
```

### Direct Composable Usage

```typescript
const sessionManager = useSessionManager();

// Check for conflicts
if (sessionManager.isAnotherSessionActive()) {
  sessionManager.handleSessionConflict();
}

// Claim session
const sessionId = sessionManager.claimSession();
```

## Security Features

1. **Unique Session IDs**: Each session gets a unique identifier
2. **Timestamp Validation**: Sessions are invalidated after 5 minutes
3. **User Agent Tracking**: Sessions include browser information
4. **Automatic Cleanup**: Stale sessions are automatically removed
5. **Cross-Tab Synchronization**: Real-time communication between tabs

## Browser Compatibility

This solution works in all modern browsers that support:

- localStorage
- Storage events
- Page Visibility API
- Event listeners

## Troubleshooting

### Issue: Sessions not being detected

- Check if the session-sync plugin is properly registered in nuxt.config.ts
- Verify localStorage is available and not blocked
- Check browser console for any JavaScript errors

### Issue: Multiple sessions still possible

- Ensure all login/logout flows use the session management functions
- Check if there are any race conditions in the authentication flow
- Verify the session validation interval is working

### Issue: Session conflicts on page refresh

- The system handles page refreshes automatically
- Sessions are validated on page load
- Stale sessions are cleaned up automatically

## Production Deployment

The solution works in both development and production environments. Key considerations:

1. **HTTPS Required**: localStorage events work properly over HTTPS
2. **Domain Consistency**: Ensure all tabs are on the same domain
3. **Browser Settings**: Some privacy settings may block localStorage
4. **Network Issues**: The solution is client-side and doesn't depend on network connectivity

## Future Enhancements

1. **Server-Side Validation**: Add server-side session tracking
2. **Session Recovery**: Implement session recovery mechanisms
3. **User Preferences**: Allow users to configure session behavior
4. **Analytics**: Track session conflicts and user behavior
5. **Mobile Support**: Optimize for mobile browser behavior
