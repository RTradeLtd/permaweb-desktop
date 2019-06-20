import { runInAction, action, configure, observable } from "mobx";
import { Textile, FilesList, Thread } from "@textile/js-http-client";
//@ts-ignore
import { toast } from "react-semantic-toasts";

const eponaSchemaV0 = {
  name: "epona-v0.0.2",
  mill: "/json",
  json_schema: {
    definitions: {},
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "http://example.com/root.json",
    type: "object",
    title: "",
    required: ["id", "body", "lastModifiedDate"],
    properties: {
      id: {
        type: "string"
      },
      body: {
        type: "string"
      },
      caption: {
        type: "string"
      },
      name: {
        type: "string"
      },
      lastModifiedDate: {
        type: "integer"
      }
    }
  }
};

const textile = new Textile({
  url: "http://127.0.0.1",
  port: 40602
});

// don't allow state modifications outside actions
configure({
  enforceActions: "always"
});

interface StoredFileSchema {
  id: string; // used to group all stored copies of file together
  body: string;
  lastModifiedDate?: number;
  name?: string; // appears to be same as caption in use below?
}
export interface UIFile {
  stored: StoredFileSchema; // this is what will go in and out of File API
  caption: string;
  hash?: string; // keeps reference for gateway linking
  key?: string; // keeps reference for gateway linking
  block?: string; // keeps track of what block is storing this file, you could enhance by using undefined to detect unstored
  date?: string;
}

class Store {
  gateway = "http://127.0.0.1:5052";
  @observable status = "offline";
  @observable profile = {
    username: undefined,
    avatar: undefined,
    updated: undefined
  };
  // TODO: instead of storing every edit as a new block, you could remove old blocks
  // on each time of file storage, thus only keeping the latest copy
  @observable files: { [id: string]: UIFile[] } = {};
  @observable fileIds: string[] = [];
  @observable file: UIFile | undefined = undefined;
  @observable selectedFileId: string = "";
  @observable selectedFileVersion: number = 0;
  @observable showHistory: boolean = false;
  @observable isLoading: boolean = false;

  appThreadKey: string = "com.getepona.eponajs.articleFeed.v0.0.3";
  appThreadName = "Epona Articles";

  appThread?: Thread;

  @action selectFileId(id: string, version: number) {
    runInAction("selectFileId", () => {
      this.selectedFileId = id
      this.selectedFileVersion = version
    });
  }

  @action toggleHistory(show: boolean) {
    runInAction("toggleHistory", () => {
      this.showHistory = show
    });
  }

  getCurrentFilePosition() {
    if (this.showHistory) {
      return this.selectedFileVersion
    } else {
      return this.fileIds.indexOf(this.selectedFileId)
    }
  }

  @action async selectFile(id: string, version: number) {
    if (!this.files) {
      return;
    }

    const editList: UIFile[] = this.files[id];
    if (!editList) {
      return;
    }

    runInAction("getFiles", () => {
      this.file = editList[version];
    });
  }
  @action async getFiles() {
    try {
      const thread = await this.getThread();
      const fileList: FilesList = await textile.files.list(
        thread.id,
        undefined,
        50
      );
      const threadFiles: { [id: string]: UIFile[] } = {};

      for (const file of fileList.items) {
        if (!file.files.length) {
          // No files in the block, so ignore
          continue;
        }
        const { caption } = file;
        const { hash, key } = file.files[0].file;
        const fileData = await textile.file.content(hash);
        if (!fileData || fileData === "") {
          // skip because no content
          continue;
        }
        const item: StoredFileSchema = JSON.parse(fileData);
        const inMemFile = {
          block: file.block,
          hash,
          key,
          caption,
          stored: item,
          date: file.date
        };

        // TODO: you could potentiall use key here instead, that way edits in the
        // caption/title would still end up being part of the same history
        if (threadFiles[item.id]) {
          threadFiles[item.id].push(inMemFile);
        } else {
          threadFiles[item.id] = [inMemFile];
        }
      }

      runInAction("getFiles", () => {
        this.status = "online";
        this.files = threadFiles;
        this.fileIds = Object.keys(threadFiles)
      });
    } catch (err) {
      runInAction("getStatus", () => {
        this.status = "offline";
      });
      toast({
        title: "Offline?",
        description: "Looks like your Textile peer is offline 😔",
        time: 0
      });
    }
  }
  @action setFile(content: string, title?: string) {
    runInAction("setFile", () => {
      if (this.file && this.file.stored.body) {
        this.file.stored.body = content;
      } else {
        const caption = title || content.split("</")[0];
        const id = this.createFileId(content);
        this.file = {
          caption,
          stored: {
            body: content,
            id
          }
        };
      }
    });
  }

  @action async createAppThread() {
    // you can used versioned json schema so you can run migrations in the future
    const addedSchema = await textile.schemas.add(eponaSchemaV0);
    // adds the new thread using a single ThreadKey shared by all files
    // that key is also versioned to help with future migrations
    const blobThread = await textile.threads.add(
      this.appThreadName,
      addedSchema.hash,
      this.appThreadKey,
      "public",
      "not_shared"
    );
    return blobThread;
  }
  @action async getOrCreateAppThread() {
    let blobThread;
    const threads = await textile.threads.list();
    for (const thread of threads.items) {
      if (thread.key === this.appThreadKey) {
        blobThread = thread;
      }
    }
    if (!blobThread) {
      blobThread = await this.createAppThread();
    }
    return blobThread;
  }

  @action async getThread() {
    // just ensure the thread is there whenever you need it.
    // return it so you can reference its id etc.
    // probabbly a cleaner way to handle this just using the param above
    if (this.appThread) {
      return this.appThread;
    }
    const thread = await this.getOrCreateAppThread();
    this.appThread = thread;
    return thread;
  }

  @action async createFile() {
    if (!this.file) {
      toast({
        title: "Error!",
        description: "Article text is required",
        type: "error",
        time: 0
      });
      return;
    }

    // get article name
    let firstLine = this.file.stored.body.split("</")[0];

    // remove html
    let temp = document.createElement("div");
    temp.innerHTML = `${firstLine}`;
    let articleName = temp.textContent || temp.innerText || "";

    if (!articleName) {
      toast({
        title: "Error!",
        description:
          "Article title is required, it is the first line of your file",
        type: "error",
        time: 0
      });
      return;
    }

    try {
      const blobThread = await this.getThread();

      const payload = {
        ...this.file.stored,
        lastModifiedDate: new Date().getTime(),
        name: articleName
      };

      // just store the JSON object (need to stringify over wire though)
      await textile.files.addFile(
        JSON.stringify(payload),
        articleName,
        blobThread.id
      );
      await this.getFiles();
      runInAction("getFile", () => {
        this.file = { ...this.file, caption: articleName, stored: payload };
      });
      toast({
        title: "Success",
        description: "Your file has been uploaded!"
      });
    } catch (ex) {
      console.log("failed to add file");
      console.error(ex);
      toast({
        title: "Error!",
        description: "Failed to create your article 😔",
        type: "error",
        time: 0
      });
    }
  }
  @action getFileFromName(filename: string) {
    try {
      const filethread = Object.keys(this.files)
        .map((id: string) => {
          return this.files[id];
        })
        .filter((file: UIFile[]) => {
          if (!file) {
            return false;
          }
          return file[0].caption === filename;
        });
      // let filethread = this.files[filename];
      let latest = filethread[0];
      return latest;
    } catch (err) {
      toast({
        title: "Error!",
        description: "No file found 😔",
        type: "error",
        time: 0
      });
      return undefined;
    }
  }

  // Just create a simple key to group all blocks about same file together
  createFileId = (body: string): string => {
    let hash = 0;
    let i;
    let chr;
    const uniqueString = body + String(new Date().getTime());
    for (i = 0; i < uniqueString.length; i++) {
      chr = uniqueString.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return String(Math.abs(hash));
  };
  @action async deleteFile(id: string) {
    try {
      if (!this.files[id] || this.files[id].length <= 0) {
        return;
      }

      this.setLoading(true);

      for (let index = 0; index < this.files[id].length; index++) {
        const file = this.files[id][index];
        if (file.block) {
          // if no block, it wasn't stored yet...
          await textile.files.ignore(file.block);
        }
      }

      runInAction("clearFile", () => {
        delete this.files[id];
      });

      this.setLoading(false);

      toast({
        title: "Success",
        description: "The latest version of your file has been deleted!"
      });
    } catch (err) {
      toast({
        title: "Error!",
        description: "Failed to delete file",
        type: "error",
        time: 0
      });
    }
  }
  @action async clearFile() {
    runInAction("clearFile", () => {
      this.file = undefined;
    });
  }
  @action async setLoading(isLoading: boolean) {
    runInAction("setLoading", () => {
      this.isLoading = isLoading;
    });
  }
}

export default Store;
