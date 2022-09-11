import { v4 as uuidv4 } from "uuid";
import path from "path";
import sqlite3 from "sqlite3";
import fs from "fs";
import { open } from "sqlite";

import config from "./config";
import log from "./log";

let db = open({
  filename: path.join(config.DB_PATH, 'db.db'),
  driver: sqlite3.Database,
});

class Files {
  async init() {
    await (await db).run("DROP TABLE IF EXISTS files");
    await (await db).run("CREATE TABLE files (id TEXT, filename TEXT, uploaded INTEGER, isPublic BOOLEAN NOT NULL CHECK (isPublic IN (0, 1)))");
  }

  async save(filename: string, isPublic: boolean): Promise<string> {
    const id = uuidv4();
    (await db).run("INSERT INTO files VALUES (?, ?, ?, ?)", [id, filename, Date.now(), isPublic ? 1 : 0]);
    return id;
  }

  async filename(id: string): Promise<string | null> {
    let results = await (await db).all("SELECT * FROM files WHERE id = ?", [id]);
    if (results && results[0])
      return results[0].filename;
    return null;
  }

  async all(page: number): Promise<any[]> {
    return (await db).all("SELECT * FROM files ORDER BY uploaded LIMIT ?, ?", [page*config.PERPAGE, config.PERPAGE]);
  }

  async clear(): Promise<void> {
    (await db).run("DELETE FROM files");
    fs.readdir(config.FILE_PATH, (err, files) => {
      if (err) log.error(err.message);
      for (const file of files) {
        const filePath = path.join(config.FILE_PATH, file);
        fs.unlinkSync(filePath);
        log.msg(`Deleted ${filePath}`);
      }
    });
  }
}

export default new Files();
