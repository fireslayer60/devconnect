import { jwtDecode } from "jwt-decode";

export function getUserFromJWT() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log(decoded);
    return decoded.username || decoded.sub || null;
    
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

export default getUserFromJWT();