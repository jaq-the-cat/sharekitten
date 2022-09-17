import { v4 as uuidv4 } from "uuid";
import path from "path";
import sqlite3  from "sqlite3";
//import fs from "fs";
import { open, Database } from "sqlite";
import { Bucket, Storage } from "@google-cloud/storage";

import config from "./config";
import log from "./log";

class Files {

  db!: Database;
  storage!: Storage;
  bucket!: Bucket;

  constructor() {
    this._init();
  }

  async _init() {
    this.db = await open({
      filename: path.join(config.DB_PATH, 'db.db'),
      driver: sqlite3.Database,
    });
    this.storage = new Storage({
      projectId: "sharekitten",
      keyFilename: "",
    });
    this.bucket = (await this.storage.createBucket((config.DEVMODE ? "staging." : "") + "sharekitten.appspot.com "))[0];
  }

  async resetDb() {
    await this.db.run("DROP TABLE IF EXISTS files");
    await this.db.run("CREATE TABLE files (id TEXT NOT NULL, filename TEXT NOT NULL, uploaded INTEGER NOT NULL, isPublic BOOLEAN NOT NULL CHECK (isPublic IN (0, 1)))");
  }

  async save(filename: string, path: string, isPublic: boolean): Promise<string> {
    const id = uuidv4();
    this.db.run("INSERT INTO files VALUES (?, ?, ?, ?)", [id, filename, Date.now(), isPublic ? 1 : 0]);
    this.bucket.upload(path, {
      destination: id,
    });
    return id;
  }

  async downloadLink(id: string) {
    return this.bucket.file(id).publicUrl();
  }

  async filename(id: string): Promise<string | null> {
    let results = await this.db.all("SELECT * FROM files WHERE id = ?", [id]);
    if (results && results[0])
      return results[0].filename;
    return null;
  }

  async public(page: number): Promise<any[]> {
    return this.db.all("SELECT * FROM files WHERE isPublic = 1 ORDER BY uploaded DESC LIMIT ?, ?", [page*config.PERPAGE, config.PERPAGE]);
  }

  async clear(): Promise<void> {
    this.db.run("DELETE FROM files");
    this.bucket.deleteFiles({ force: true });
  }
}

export default new Files;
