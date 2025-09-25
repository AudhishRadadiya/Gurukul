import { http, HttpResponse } from "msw";

export const authHandlers = [
  http.post("/api/auth/login", () => {
    return HttpResponse.json({
      token: "mock-jwt-token",
      user: {
        email: "test@example.com",
        id: "1",
        name: "Test User",
      },
    });
  }),

  http.get("/api/auth/me", () => {
    return HttpResponse.json({
      user: {
        email: "test@example.com",
        id: "1",
        name: "Test User",
      },
    });
  }),
];
