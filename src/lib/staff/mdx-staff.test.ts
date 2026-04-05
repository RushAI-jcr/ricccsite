import { describe, it, expect } from "vitest";
import { parseMember, serializeMember } from "./mdx-staff";
import type { MemberFrontmatter } from "./types";

describe("parseMember / serializeMember round-trip", () => {
  it("preserves bio and mission fields", () => {
    const fm: MemberFrontmatter = {
      name: "Test User, PhD",
      role: "Researcher",
      tier: "staff",
      email: "t@example.com",
      mission_subtitle: "Short line",
      mission_blurb: "Two sentences for mission.",
    };
    const bio = "First paragraph.\n\n**Education**\n\n- Item";
    const mdx = serializeMember(bio, fm);
    const { frontmatter, bio: outBio } = parseMember(mdx);
    expect(outBio).toBe(bio);
    expect(frontmatter.name).toBe(fm.name);
    expect(frontmatter.mission_subtitle).toBe("Short line");
    expect(frontmatter.mission_blurb).toBe("Two sentences for mission.");
  });

  it("omits empty optional strings from YAML on serialize", () => {
    const fm: MemberFrontmatter = {
      name: "A",
      role: "R",
      tier: "staff",
      email: "a@b.co",
      mission_subtitle: "",
      mission_blurb: "",
    };
    const mdx = serializeMember("Bio text.", fm);
    expect(mdx).not.toContain("mission_subtitle");
    expect(mdx).not.toContain("mission_blurb");
    const { frontmatter } = parseMember(mdx);
    expect(frontmatter.mission_subtitle).toBeUndefined();
    expect(frontmatter.mission_blurb).toBeUndefined();
  });
});
