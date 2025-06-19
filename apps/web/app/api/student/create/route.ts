import { syncStudentData } from "@repo/db/actions";
import { connectDb, Users } from "@repo/db/mongodb";
import { studentSchema } from "@repo/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const formdata = await studentSchema.parseAsync(payload);

    await connectDb();
    const isUserExist = await Users.findOne({ email: formdata.email });

    if (isUserExist) throw new Error("User Already Exists!");

    const student = await Users.create(formdata);
    await syncStudentData(student);
    return NextResponse.json({ ok: true, student });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: (error as Error).message });
  }
}
