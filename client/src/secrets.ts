// src/secrets.ts

export const secrets = {
  backendEndpoint: import.meta.env.VITE_BACKEND_ENDPOINT || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
};
