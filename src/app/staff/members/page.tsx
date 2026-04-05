import type { Metadata } from "next";
import { MemberList } from "@/components/staff/member-list";

export const metadata: Metadata = { title: "Members | Staff Admin" };

export default function MembersPage() {
  return <MemberList />;
}
