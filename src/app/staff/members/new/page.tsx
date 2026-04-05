import type { Metadata } from "next";
import { MemberForm } from "@/components/staff/MemberForm";

export const metadata: Metadata = { title: "Add Member — Staff Admin" };

export default function NewMemberPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-rush-on-surface mb-8">Add Member</h1>
      <MemberForm mode="create" />
    </div>
  );
}
