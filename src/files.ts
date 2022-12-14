import {v4 as uuidv4} from "uuid";
//import fs from "fs";
import {Bucket, File, Storage} from "@google-cloud/storage";

import config from "./config";
import log from './log';

class Files {
  private storage!: Storage;
  private bucket!: Bucket;

  constructor() {
    this.init();
  }

  private async init() {
    this.storage = new Storage({
      projectId: "sharekitten",
      keyFilename: config.GCLOUD_CRED,
    });
    this.bucket = this.storage.bucket((config.DEVMODE ? "staging." : "") + "sharekitten.appspot.com");
  }

  async saveAs(filename: string, path: string, isPublic: boolean): Promise<string> {
    const id = (isPublic ? "P" : "N") + uuidv4();
    await this.bucket.upload(path, {
      destination: id,
      metadata: {
        metadata: {
          "SKname": filename,
        }
      }
    }).catch((e) => {
      log.error(e);
    });
    return id;
  }

  async downloadLink(id: string, callback: (filename: string) => void) {
    const destination = `/tmp/${id}`;
    await this.bucket.file(id).download({
      destination,
    });
    callback(destination);
  }

  async nameOf(id: string): Promise<string | null> {
    return (await this.bucket.file(id).getMetadata())[0].metadata.SKname;
  }

  async getPublic(page: number): Promise<File[]> {
    const [files] = await this.bucket.getFiles({
      prefix: "P",
    });
    const ffIndex = page*config.PERPAGE; // index of the first file in the page (page 0 * 20 = element 0; page 1 * 20 = element 20; page 2 * 20 = element 40, ...)
    files.forEach((file) => {
      console.log(file.metadata.metadata);
    })
    return files.slice(ffIndex, ffIndex+config.PERPAGE-1); // dont include last item because it's also on the next page
  }

  async clear(): Promise<void> {
    this.bucket.deleteFiles({ force: true }).catch((e) => {
      log.error(e);
    });
  }
}

export default new Files;
