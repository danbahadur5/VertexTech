import { describe, it, expect, vi, beforeEach } from "vitest";
import { requireSession, requireRole } from "../lib/rbac";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { AppUser } from "../models";

// Mock dependencies
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

vi.mock("../lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("../lib/db", () => ({
  connectDB: vi.fn(),
}));

vi.mock("../models", () => ({
  AppUser: {
    findOne: vi.fn(),
  },
}));

describe("RBAC Utility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("requireSession", () => {
    it("returns session when user is authenticated", async () => {
      const mockSession = { user: { id: "123", name: "Test User" } };
      vi.mocked(headers).mockResolvedValue({} as any);
      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any);

      const result = await requireSession();
      expect(result).toEqual(mockSession);
    });

    it("returns null when user is not authenticated", async () => {
      vi.mocked(headers).mockResolvedValue({} as any);
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const result = await requireSession();
      expect(result).toBeNull();
    });
  });

  describe("requireRole", () => {
    it("returns session and profile when user has required role", async () => {
      const mockSession = { user: { id: "123" } };
      const mockProfile = { id: "p123", role: "admin" };
      
      vi.mocked(headers).mockResolvedValue({} as any);
      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any);
      vi.mocked(AppUser.findOne).mockResolvedValue(mockProfile as any);

      const result = await requireRole(["admin"]);
      expect(result).toEqual({ session: mockSession, profile: mockProfile });
    });

    it("returns null when user does not have required role", async () => {
      const mockSession = { user: { id: "123" } };
      const mockProfile = { id: "p123", role: "client" };
      
      vi.mocked(headers).mockResolvedValue({} as any);
      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any);
      vi.mocked(AppUser.findOne).mockResolvedValue(mockProfile as any);

      const result = await requireRole(["admin"]);
      expect(result).toBeNull();
    });

    it("returns null when session is missing", async () => {
      vi.mocked(headers).mockResolvedValue({} as any);
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const result = await requireRole(["admin"]);
      expect(result).toBeNull();
    });
  });
});
