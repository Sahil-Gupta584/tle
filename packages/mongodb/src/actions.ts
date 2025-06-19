"use server";
import axios from "axios";
import { Contests, Problems, Users } from "./mongodb";
import { Contest, Problem, Student } from "./schema";

export const CF_API_BASE_URL = "https://codeforces.com/api";

export async function syncStudentData(s: Student) {
  // Fetch and update student rating info
  const infoRes = await axios.get(
    `${CF_API_BASE_URL}/user.info?handles=${s.cf_handle}`
  );
  const studentInfo = infoRes.data?.result?.[0];
  await Users.updateOne(
    { _id: s._id },
    {
      maxRating: studentInfo.maxRating,
      currentRating: studentInfo.rating,
    }
  );
  console.log("updated user info");

  const newContests: Contest[] = [];

  const res = await axios.get(
    `${CF_API_BASE_URL}/user.rating?handle=${s.cf_handle}`
  );
  const allContest: Contest[] = res.data.result;

  for (const c of allContest) {
    const exists = await Contests.findOne({
      contestId: c.contestId,
      handle: s._id,
    });
    console.log(allContest.indexOf(c));

    if (!exists) {
      newContests.push({ ...c, handle: s });
    }
  }

  if (newContests.length > 0) {
    const insertedContests = await Contests.insertMany(newContests);
    await Users.updateOne(
      { _id: s._id },
      { $push: { contests: { $each: insertedContests.map((c) => c._id) } } }
    );
  }
  console.log("updated user contests");

  // sync  problems
  const problemBatchSize = 10;
  let problemStart = 1;
  const fetchedProblems: Problem[] = [];

  while (true) {
    const res = await axios.get(
      `${CF_API_BASE_URL}/user.status?handle=${s.cf_handle}&from=${problemStart}&count=${problemBatchSize}`
    );
    const batch = res.data?.result as Problem[];
    console.log({ cbatch: problemStart });

    if (!batch || batch.length === 0) break;

    let anyNew = false;

    for (const p of batch) {
      const existing = await Problems.findOne({ id: p.id });

      if (!existing) {
        fetchedProblems.push({
          id: p.id,
          contestId: p.contestId,
          creationTimeSeconds: p.creationTimeSeconds,
          problem: p.problem,
          verdict: p.verdict,
          author: { members: [s] },
        });
        anyNew = true;
      } else {
        const isMember = existing.author.members.some(
          (m: string) => m === s._id
        );

        if (!isMember) {
          await Problems.updateOne(
            { id: p.id },
            { $push: { "author.members": s._id } }
          );
        }
      }
    }

    if (!anyNew) break;
    problemStart += problemBatchSize;
  }

  if (fetchedProblems.length > 0) {
    const insertedProblems = await Problems.insertMany(fetchedProblems);
    await Users.updateOne(
      { _id: s._id },
      { $push: { problems: { $each: insertedProblems.map((p) => p._id) } } }
    );
  }
  console.log("updated user problems");
}
