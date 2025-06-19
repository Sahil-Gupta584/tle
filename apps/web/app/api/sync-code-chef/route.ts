import { syncStudentData } from "@repo/db/actions";
import { connectDb, Users } from "@repo/db/mongodb";
import { Student } from "@repo/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const students: Student[] = await Users.find({});
    if (students) {
      for (const s of students) {
        await syncStudentData(s);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: (error as Error).message });
  }
}
