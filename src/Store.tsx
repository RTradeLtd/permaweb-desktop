import { runInAction, action, configure, observable } from "mobx";
import { Textile, FilesList, Thread } from "@textile/js-http-client";
//@ts-ignore
import { toast } from "react-semantic-toasts";

const eponaSchemaV0 = {
  name: "epona-v1",
  mill: "/json",
  json_schema: {
    definitions: {},
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "http://example.com/root.json",
    type: "object",
    title: "",
    required: ["key", "body", "caption", "lastModifiedDate"],
    properties: {
      key: {
        type: "number"
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
  key: number; // used to group all stored copies of file together
  body: string;
  caption: string;
  lastModifiedDate?: number;
  name?: string; // appears to be same as caption in use below?
}
interface UIFile {
  stored: StoredFileSchema; // this is what will go in and out of File API
  hash?: string; // keeps reference for gateway linking
  key?: string; // keeps reference for gateway linking
  block?: string; // keeps track of what block is storing this file, you could enhance by using undefined to detect unstored
}

class Store {
  gateway = "http://127.0.0.1:5052";
  @observable status = "offline";
  @observable profile = {
    username: undefined,
    avatar: undefined
  };
  @observable files: { [key: string]: UIFile[] } = {};
  @observable file: UIFile | undefined = undefined;

  appThreadKey: string = "com.getepona.eponajs.articleFeed.v0.0.1";
  appThreadName = "Epona Articles";

  appThread?: Thread;

  @action async getFiles() {
    try {
      const thread = await this.getThread();
      const files: FilesList = await textile.files.list(
        thread.id,
        undefined,
        50
      );
      const threadFiles: { [key: string]: UIFile[] } = {};

      for (const file of files.items) {
        if (!file.files.length) {
          // No files in the block, so ignore
          continue;
        }
        const { hash, key } = file.files[0].file;
        const fileData = await textile.files.fileData(hash);
        if (!fileData || fileData === "") {
          // skip because no content
          continue;
        }
        const item: StoredFileSchema = JSON.parse(fileData);
        const inMemFile = {
          block: file.block,
          hash,
          key,
          stored: item
        };

        // TODO: you could potentiall use key here instead, that way edits in the
        // caption/title would still end up being part of the same history
        if (threadFiles[item.caption]) {
          threadFiles[item.caption].push(inMemFile);
        } else {
          threadFiles[item.caption] = [inMemFile];
        }
      }

      runInAction("getFiles", () => {
        this.status = "online";
        this.files = threadFiles;
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
      }
      const caption = title || content.split("</")[0];
      const key = this.createFileKey(content);
      this.file = {
        stored: {
          body: content,
          caption,
          key
        }
      };
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

      this.file.stored.lastModifiedDate = new Date().getTime();
      this.file.stored.name = articleName;

      // just store the JSON object (need to stringify over wire though)
      await textile.files.addFile(
        JSON.stringify(this.file.stored),
        articleName,
        blobThread.id
      );

      toast({
        title: "Success",
        description: "Your file has been uploaded!"
      });
      runInAction("getFile", () => {
        this.file = this.file;
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
      let filethread = this.files[filename];
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
  // Don't use anymore, as raw file data gathered at block parse time
  // @action async getFileContent(hash: string) {
  //   try {
  //     const bytes = await textile.files.fileData(hash);
  //     // const bytes = await textile.ipfs.cat(hash, key)
  //     runInAction("getFile", () => {
  //       this.file = JSON.parse(bytes);
  //     });
  //   } catch (err) {
  //     toast({
  //       title: "Error!",
  //       description: "Failed to get file",
  //       type: "error",
  //       time: 0
  //     });
  //     console.log(err);
  //   }
  // }

  // Just create a simple key to group all blocks about same file together
  createFileKey = (body: string): number => {
    let hash = 0;
    let i;
    let chr;
    const uniqueString = body + String(new Date().getTime());
    for (i = 0; i < uniqueString.length; i++) {
      chr = uniqueString.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
  @action async deleteLatestFile(filename: string) {
    try {
      const filethread = this.files[filename];
      const latest = filethread.shift();
      if (!latest) {
        return;
      }

      if (latest.block) {
        // if no block, it wasn't stored yet...
        await textile.files.ignore(latest.block);
      }

      // no more files left
      if (filethread.length <= 0) {
        runInAction("clearFile", () => {
          delete this.files[filename];
        });
      }
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
      console.log(err);
    }
  }
  @action async clearFile() {
    runInAction("clearFile", () => {
      this.file = undefined;
    });
  }
}

export default Store;
