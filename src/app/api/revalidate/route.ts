import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/publications");
  revalidatePath("/"); // Home page spotlights
  revalidatePath("/team");
  revalidatePath("/mission");

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}
