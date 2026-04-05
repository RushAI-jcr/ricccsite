import { Octokit } from "@octokit/rest";
import type { GitHubFileResult, TeamFileEntry } from "./types";

// Hardcoded — this is a single-repo internal tool
const OWNER = "riccc-rush-lab";
const REPO = "ricccsite";

// Module-level singleton — reused across warm Lambda invocations
const octokit = new Octokit({
  auth: process.env.GITHUB_BOT_TOKEN,
});

const COMMITTER = {
  name: "RICCC Admin Bot",
  email: "info@riccc-lab.com",
};

export async function getFile(filePath: string): Promise<GitHubFileResult> {
  const { data } = await octokit.rest.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: filePath,
  });

  // Guard: directory responses are arrays; file responses have type === "file"
  if (Array.isArray(data) || data.type !== "file") {
    throw new Error(`Path is not a file: ${filePath}`);
  }

  // data.content has embedded \n chars in base64 — strip before decoding
  const content = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
  return { content, sha: data.sha };
}

export async function upsertFile(
  filePath: string,
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: filePath,
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
    committer: COMMITTER,
    ...(sha ? { sha } : {}),
  });
}

export async function upsertBinaryFile(
  filePath: string,
  data: Buffer,
  message: string,
  sha?: string
): Promise<void> {
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: filePath,
    message,
    content: data.toString("base64"),
    committer: COMMITTER,
    ...(sha ? { sha } : {}),
  });
}

export async function listTeamFiles(): Promise<TeamFileEntry[]> {
  const { data } = await octokit.rest.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: "content/team",
  });

  if (!Array.isArray(data)) return [];

  return data
    .filter((f) => f.type === "file" && f.name.endsWith(".mdx"))
    .map((f) => ({
      slug: f.name.replace(/\.mdx$/, ""),
      path: f.path,
      sha: f.sha,
    }));
}

// Get only the SHA for an existing file (used for photo existence checks)
export async function getFileSha(filePath: string): Promise<string | null> {
  try {
    const result = await getFile(filePath);
    return result.sha;
  } catch (err: unknown) {
    // @ts-expect-error -- Octokit error shape
    if (err?.status === 404) return null;
    throw err;
  }
}
