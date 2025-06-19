// import { connectDb, Users } from "@/app/lib/mongodb";
// import { CF_API_BASE_URL } from "@/app/lib/utils";
// import axios from "axios";
// import console from "console";
// import { ObjectId } from "mongodb";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     const search = req.nextUrl.searchParams;

//     const studentId = search.get("studentId");
//     if (!studentId) throw new Error("studentId not found");

//     await connectDb();

//     let student = await Users.findById({ _id: new ObjectId(studentId) });

//     if (!student) throw new Error("Student not found");
//     if (student) {
//       student = student.toObject();
//       const studentContests = await axios.get(
//         CF_API_BASE_URL + `/user.rating?handle=${student.cf_handle}`
//       );
//       student.contests = studentContests.data.result || [];

//       const studentProblems = await axios.get(
//         CF_API_BASE_URL + `/user.status?handle=${student.cf_handle}`
//       );
//       student.problems = studentProblems.data.result || [];
//     }

//     return NextResponse.json({ ok: true, student });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ ok: false, error: (error as Error).message });
//   }
// }

import { connectDb, Users } from "@/app/lib/mongodb";
import console from "console";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams;

    const studentId = search.get("studentId");
    if (!studentId) throw new Error("studentId not found");

    await connectDb();

    const student = await Users.findById({ _id: new ObjectId(studentId) })
      .populate("contests")
      .populate("problems");
    if (!student) throw new Error("Student Not Found");

    return NextResponse.json({ ok: true, student });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: (error as Error).message });
  }
}
