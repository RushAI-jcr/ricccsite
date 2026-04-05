#!/usr/bin/env node
/**
 * Lists external profile URLs from content/team/*.mdx and optionally checks HTTP status.
 * Does not discover new URLs — add LinkedIn, Scholar, etc. in frontmatter or /admin/.
 *
 * Usage:
 *   node scripts/audit-team-links.mjs           # list only
 *   node scripts/audit-team-links.mjs --check   # HEAD request per URL (needs network)
 */

import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const matter = require("gray-matter");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const teamDir = path.join(root, "content", "team");

const doCheck = process.argv.includes("--check");

function orcidUrl(id) {
  if (id == null || id === "") return null;
  const trimmed = String(id).trim();
  if (!trimmed) return null;
  return `https://orcid.org/${trimmed}`;
}

function githubUrl(username) {
  if (!username || typeof username !== "string") return null;
  const u = username.trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "");
  return u ? `https://github.com/${u}` : null;
}

async function headStatus(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: ctrl.signal,
    });
    return res.status;
  } catch (e) {
    return `err: ${e.cause?.code || e.name || String(e.message).slice(0, 40)}`;
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  if (!fs.existsSync(teamDir)) {
    console.error("No content/team directory.");
    process.exit(1);
  }

  const files = fs.readdirSync(teamDir).filter((f) => f.endsWith(".mdx"));
  /** @type {{ name: string, slug: string, links: { label: string, url: string }[] }[]} */
  const rows = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(teamDir, file), "utf-8");
    const { data } = matter(raw);
    const name = data.name || file.replace(/\.mdx$/, "");
    if (name === "TBD") continue;

    const slug = file.replace(/\.mdx$/, "");
    const links = [];

    if (data.scholar) links.push({ label: "Google Scholar", url: String(data.scholar).trim() });
    if (data.linkedin) links.push({ label: "LinkedIn", url: String(data.linkedin).trim() });
    if (data.website) links.push({ label: "Website", url: String(data.website).trim() });
    const gh = githubUrl(data.github);
    if (gh) links.push({ label: "GitHub", url: gh });
    const oc = orcidUrl(data.orcid);
    if (oc) links.push({ label: "ORCID", url: oc });

    rows.push({ name, slug, links });
  }

  console.log("# Team profile URLs (from MDX frontmatter)\n");
  console.log("| Name | Slug | Link type | URL |");
  console.log("|------|------|-----------|-----|");

  for (const r of rows) {
    if (r.links.length === 0) {
      console.log(`| ${r.name} | ${r.slug} | — | *none listed* |`);
      continue;
    }
    for (const L of r.links) {
      let extra = "";
      if (doCheck) {
        extra = ` (${await headStatus(L.url)})`;
      }
      console.log(`| ${r.name} | ${r.slug} | ${L.label} | ${L.url}${extra} |`);
    }
  }

  console.log("\n---");
  console.log(
    doCheck
      ? "HTTP status in parentheses (HEAD; some sites block HEAD — use browser if odd)."
      : "Run with --check to probe each URL (requires network)."
  );
  console.log("PubMed uses pubmed_name (not a single URL). Photos use photo path under /images/team/.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
