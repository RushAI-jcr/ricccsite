import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberForm } from "@/components/staff/member-form";
import { getFile } from "@/lib/staff/github";
import { parseMember } from "@/lib/staff/mdx-staff";

interface EditPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Edit ${slug} | Staff Admin` };
}

export default async function EditMemberPage({ params }: EditPageProps) {
  const { slug } = await params;
  const filePath = `content/team/${slug}.mdx`;

  let frontmatter: ReturnType<typeof parseMember>["frontmatter"] | null = null;
  let bio = "";
  try {
    const { content } = await getFile(filePath);
    const parsed = parseMember(content);
    frontmatter = parsed.frontmatter;
    bio = parsed.bio;
  } catch {
    notFound();
  }

  if (!frontmatter) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-rush-on-surface mb-8">Edit Member</h1>
      <MemberForm
        mode="edit"
        slug={slug}
        initialValues={{ ...frontmatter, bio }}
      />
    </div>
  );
}
