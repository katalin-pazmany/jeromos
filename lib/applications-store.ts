import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "applications.json");

export interface Application {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  garden: string;
  otherPets: string;
  dog: string;
  intro: string;
}

// Keep a local copy of every application so nothing is lost even if email
// delivery isn't configured. This file holds personal data — keep it private.
export async function saveApplication(app: Application): Promise<void> {
  let list: Application[] = [];
  try {
    list = JSON.parse(await fs.readFile(DATA_PATH, "utf8"));
  } catch {
    list = [];
  }
  list.unshift(app);
  await fs.writeFile(DATA_PATH, JSON.stringify(list, null, 2), "utf8");
}
