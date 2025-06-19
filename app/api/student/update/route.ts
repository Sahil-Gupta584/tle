import { connectDb, Users } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formdata = await req.json();

    await connectDb();
    const isUserExist = await Users.findOne({
      _id: new ObjectId(formdata._id),
    });

    if (!isUserExist) throw new Error("User not found!");

    const user = await Users.findByIdAndUpdate(
      { _id: new ObjectId(formdata._id) },
      formdata
    );
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: (error as Error).message });
  }
}
