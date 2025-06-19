"use server";
import axios from "axios";
import { Contests, Problems, Users } from "./mongodb";
import { Contest, Problem, Student } from "./schema";

export const CF_API_BASE_URL = "https://codeforces.com/api";

export async function syncStudentData(s: Student) {
  const [infoRes, contestsRes, submissionsRes] = await Promise.all([
    axios.get(`${CF_API_BASE_URL}/user.info?handles=${s.cf_handle}`),
    axios.get(`${CF_API_BASE_URL}/user.rating?handle=${s.cf_handle}`),
    axios.get(`${CF_API_BASE_URL}/user.status?handle=${s.cf_handle}`),
  ]);

  const studentInfo = infoRes.data?.result?.[0];
  const allContests: Contest[] = contestsRes.data?.result || [];
  const allProblems: Problem[] = submissionsRes.data?.result || [];

  // Update user ratings
  await Users.updateOne(
    { _id: s._id },
    {
      maxRating: studentInfo.maxRating,
      currentRating: studentInfo.rating,
    }
  );

  // Save new contests
  const newContests: Contest[] = [];
  for (const c of allContests) {
    const isExists = await Contests.findOne({
      contestId: c.contestId,
      handle: s._id,
    });
    if (!isExists) newContests.push({ ...c, handle: s });
  }

  if (newContests.length > 0) {
    const insertedContests = await Contests.insertMany(newContests);
    await Users.updateOne(
      { _id: s._id },
      {
        $push: {
          contests: {
            $each: insertedContests.map((c) => c._id),
          },
        },
      }
    );
  }
  // Save new problems
  const newProblems: Problem[] = [];
  for (const p of allProblems) {
    const isExists = await Problems.findOne({ id: p.id });

    if (!isExists) {
      newProblems.push({
        id: p.id,
        contestId: p.contestId,
        creationTimeSeconds: p.creationTimeSeconds,
        problem: p.problem,
        verdict: p.verdict,
        author: { members: [s] },
      });
    } else {
      const alreadyAdded = isExists.author.members.some(
        (m: { handle: string }) => m.handle === s.cf_handle
      );
      if (!alreadyAdded) {
        await Problems.findOneAndUpdate(
          { id: p.id },
          { $push: { "author.members": s._id } }
        );
      }
    }
  }

  if (newProblems.length > 0) {
    const insertedProblems = await Problems.insertMany(newProblems);
    await Users.updateOne(
      { _id: s._id },
      { $push: { problems: { $each: insertedProblems.map((p) => p._id) } } }
    );
  }
}
