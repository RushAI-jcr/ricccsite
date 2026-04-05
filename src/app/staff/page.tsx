import { redirect } from "next/navigation";
import { getSession } from "@/lib/staff/auth";

export default async function StaffPage() {
  const session = await getSession();
  if (session.authenticated) {
    redirect("/staff/members");
  } else {
    redirect("/staff/login");
  }
}
