import { syncStudentData } from "@repo/db/actions";
import { connectDb, Users } from "@repo/db/mongodb";
import { Student } from "@repo/db/schema";
import dotenv from "dotenv";
import express from "express";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../../../.env") });

const app = express();

// app.get("/sync-code-chef", async (req, res: Response) => {
async function cron() {
  try {
    console.log("started");

    await connectDb();
    const students: Student[] = await Users.find({});
    if (students) {
      for (const s of students) {
        await syncStudentData(s);
      }
      // await Promise.all(students.map(async (s) => await syncStudentData(s)));
    }
    console.log("eded");

    // res.json({ ok: true });
  } catch (error) {
    console.log(error);
    // res.json({ ok: false, error: (error as Error).message });
  }
}
(async () => {
  await cron();
})();
// });
const PORT = 3001;
app.listen(PORT, () => console.log("listening on ", PORT));
