
import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token: string) {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}
