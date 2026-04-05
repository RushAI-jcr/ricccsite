import { describe, it, expect } from "vitest";
import { MemberSchema } from "./validation";

const base = {
  name: "Test Member",
  role: "Researcher",
  tier: "staff" as const,
  email: "test@example.com",
  bio: "",
};

describe("MemberSchema github", () => {
  it("normalizes profile URLs to username", () => {
    const r = MemberSchema.safeParse({
      ...base,
      github: "https://github.com/octo-cat",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.github).toBe("octo-cat");
  });

  it("accepts bare username", () => {
    const r = MemberSchema.safeParse({
      ...base,
      github: "octocat",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.github).toBe("octocat");
  });

  it("normalizes empty to empty string", () => {
    const r = MemberSchema.safeParse({
      ...base,
      github: "",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.github).toBe("");
  });
});
