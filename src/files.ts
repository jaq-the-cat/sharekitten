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
    (await db).run("DROP TABLE IF EXISTS files; CREATE TABLE files (id text, filename text)");
  }

  async save(filename: string): Promise<string> {
    const id = uuidv4();
    (await db).run("INSERT INTO files VALUES (?, ?)", [id, filename]);
    return id;
  }

  async filename(id: string): Promise<string | null> {
    let results = await (await db).all("SELECT * FROM files WHERE id = ?", [id]);
    if (results && results[0])
      return results[0].filename;
    return null;
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
