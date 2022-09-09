import { v4 as uuidv4 } from "uuid";
import path from "path";
import config from './config';
import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = open({
  filename: path.join(config.DB_PATH, 'db.db'),
  driver: sqlite3.Database,
});

export async function initdb() {
  (await db).run("CREATE TABLE files (id text, filename text)");
}

class Files {
  async save(filename: string): Promise<string> {
    const id = uuidv4();
    (await db).run("INSERT INTO files VALUES (?, ?)", [id, filename]);
    return id;
  }

  async filename(id: string): Promise<string | null> {
    let results = await (await db).all("SELECT * FROM files WHERE id = ?", [id]);
    return results[0].filename;
  }

  async clear(): Promise<void> {
    (await db).run("DELETE FROM files");
  }
}

export default new Files();
