import { connectDb, Users } from "@repo/db/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams;
    const studentId = search.get("studentId");

    if (!studentId) throw new Error("studentId not found!");

    await connectDb();
    const isUserExist = await Users.findOne({ _id: new ObjectId(studentId) });
    if (!isUserExist) throw new Error("User not found!");

    await Users.deleteOne({ _id: new ObjectId(studentId) });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: (error as Error).message });
  }
}
