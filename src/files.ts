import fs from 'fs';
import path from "path";
import sqlite3 from "sqlite3";
import {v4 as uuidv4} from "uuid";
//import fs from "fs";
import {Bucket, Storage} from "@google-cloud/storage";
import {Database, open} from "sqlite";

import config from "./config";
import log from './log';

class Files {
  private db!: Promise<Database>;
  private storage!: Storage;
  private bucket!: Bucket;

  constructor() {
    this.init();
  }

  private async init() {
    this.db = open({
      filename: path.join(config.DB_PATH, 'db.db'),
      driver: sqlite3.Database,
    });
    this.storage = new Storage({
      projectId: "sharekitten",
      keyFilename: config.GCLOUD_CRED,
    });
    this.bucket = this.storage.bucket((config.DEVMODE ? "staging." : "") + "sharekitten.appspot.com");
  }

  async resetDb() {
    await (await this.db).run("DROP TABLE IF EXISTS files");
    await (await this.db).run("CREATE TABLE files (id TEXT NOT NULL, filename TEXT NOT NULL, uploaded INTEGER NOT NULL, isPublic BOOLEAN NOT NULL CHECK (isPublic IN (0, 1)))");
  }

  async saveAs(filename: string, path: string, isPublic: boolean): Promise<string> {
    const id = uuidv4();
    (await this.db).run("INSERT INTO files VALUES (?, ?, ?, ?)", [id, filename, Date.now(), isPublic ? 1 : 0]);
    this.bucket.upload(path, {
      destination: id,
    });
    return id;
  }

  async downloadLink(id: string, callback: (filename: string) => void): Promise<void> {
    const destination = `/tmp/${id}`;
    await this.bucket.file(id).download({
      destination,
    });
    callback(destination);
    fs.unlink(id, (err) => {
      if (err) log.error(err);
      log.msg(`Deleted temporary file ${destination}`);
    });
  }

  async nameOf(id: string): Promise<string | null> {
    let results = await (await this.db).all("SELECT * FROM files WHERE id = ?", [id]);
    if (results && results[0])
      return results[0].filename;
    return null;
  }

  async getPublic(page: number): Promise<any[]> {
    return (await this.db).all("SELECT * FROM files WHERE isPublic = 1 ORDER BY uploaded DESC LIMIT ?, ?", [page*config.PERPAGE, config.PERPAGE]);
  }

  async clear(): Promise<void> {
    (await this.db).run("DELETE FROM files");
    this.bucket.deleteFiles({ force: true });
  }
}

export default new Files;
