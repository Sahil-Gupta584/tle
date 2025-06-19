import { sendReminderEmail, syncStudentData } from "@/app/lib/actions";
import { connectDb, Users } from "@/app/lib/mongodb";
import { Student } from "@/app/lib/schema";
import { CF_API_BASE_URL } from "@/app/utils";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const students: Student[] = await Users.find({});
    if (students) {
      for (const s of students) {
        const res = await axios.get(
          `${CF_API_BASE_URL}/user.status?handle=${s.cf_handle}&count=1`
        );
        const latest = res.data?.result?.[0];
        if (
          !latest ||
          latest.creationTimeSeconds * 1000 <
            Date.now() - 7 * 24 * 60 * 60 * 1000
        ) {
          await sendReminderEmail(s.email, s.name);
        }

        await syncStudentData(s);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: (error as Error).message });
  }
}
