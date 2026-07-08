export const BASE_URL = 
  typeof window !== 'undefined' && window.location.hostname === "localhost" 
    ? "https://dev-tinder-backend-kappa.vercel.app/" 
    : "/api"; // <--- THIS IS THE KEY