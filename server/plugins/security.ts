export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:response", (response, { event }) => {
    // Remove sensitive headers
    if (response.headers) {
      delete response.headers["x-powered-by"];
      delete response.headers["server"];

      // Add security headers
      response.headers["X-Content-Type-Options"] = "nosniff";
      response.headers["X-Frame-Options"] = "DENY";
      response.headers["X-XSS-Protection"] = "1; mode=block";
      response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
      response.headers["Strict-Transport-Security"] =
        "max-age=31536000; includeSubDomains";
      response.headers["Content-Security-Policy"] =
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';";
    }
  });
});
