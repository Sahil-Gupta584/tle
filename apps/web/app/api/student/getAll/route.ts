import { connectDb, Users } from "@repo/db/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const students = await Users.find({});
    return NextResponse.json({ ok: true, students });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: (error as Error).message });
  }
}
