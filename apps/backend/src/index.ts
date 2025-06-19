import { syncStudentData } from "@repo/db/actions";
import { connectDb, Users } from "@repo/db/mongodb";
import { Student } from "@repo/db/schema";
import dotenv from "dotenv";
import express, { Response } from "express";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../../../.env") });

const app = express();

app.get("/sync-code-chef", async (req, res: Response) => {
  try {
    await connectDb();
    const students: Student[] = await Users.find({});
    if (students) {
      await Promise.all(students.map(async (s) => await syncStudentData(s)));
    }

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.json({ ok: false, error: (error as Error).message });
  }
});
const PORT = 3001;
app.listen(PORT, () => console.log("listening on ", PORT));
