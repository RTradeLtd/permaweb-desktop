import { runInAction, action, configure, observable } from "mobx";
import { Textile, FilesList, File, BlockList } from "@textile/js-http-client";
//@ts-ignore
import { toast } from "react-semantic-toasts";

const textile = new Textile({
  url: "http://127.0.0.1",
  port: 40602
});

// don't allow state modifications outside actions
configure({
  enforceActions: "always"
});

interface FileSchema {
  lastModifiedDate: number;
  name: string; // appears to be same as caption in use below?
  caption: string;
  body: string;
  block: string; // keeps track of what block is storing this file, you could enhance by using undefined to detect unstored
}

class Store {
  gateway = "http://127.0.0.1:5052";
  @observable status = "offline";
  @observable profile = {
    username: undefined,
    avatar: undefined
  };
  @observable files: { [key: string]: FileSchema[] } = {};
  @observable file: FileSchema | undefined = undefined;
  @action async getFiles(threadId: string) {
    try {
      const files: FilesList = await textile.files.list(
        threadId,
        undefined,
        10
      );
      const threadFiles: { [key: string]: FileSchema[] } = {};

      for (const file of files.items) {
        if (!file.files.length) {
          // No files in the block, so ignore
          continue;
        }
        const fileData = await textile.files.fileData(file.files[0].file.hash);
        if (!fileData || fileData === "") {
          // skip because no content
          continue;
        }
        const item: FileSchema = JSON.parse(fileData);
        // keep track of the block which owns the file
        item.block = file.block;
        if (threadFiles[item.caption]) {
          threadFiles[item.caption].push(item);
        } else {
          threadFiles[item.caption] = [item];
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
  @action setFile(file: FileSchema) {
    runInAction("setFile", () => {
      this.file = file;
    });
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
    let firstLine = this.file.body.split("</")[0];

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

    const THREAD_NAME = articleName;
    const THREAD_KEY = articleName;

    try {
      let blobThread;
      const threads = await textile.threads.list();
      for (const thread of threads.items) {
        if (thread.key === THREAD_KEY) {
          blobThread = thread;
        }
      }
      if (!blobThread) {
        const schemas = await textile.schemas.defaults();
        const blobSchema = schemas.blob;
        // delete blobSchema.use
        const addedSchema = await textile.schemas.add(blobSchema);

        blobThread = await textile.threads.add(
          THREAD_NAME,
          addedSchema.hash,
          THREAD_KEY,
          "public",
          "not_shared"
        );
      }

      // const form = new FormData()
      // const blob = new Blob([this.file], {
      //   type: 'text/plain'
      // })
      this.file.lastModifiedDate = new Date().getTime();
      this.file.name = articleName;
      // form.append('file', blob, articleName)

      await textile.files.addFile(this.file, articleName, blobThread.id);

      toast({
        title: "Success",
        description: "Your file has been uploaded!"
      });
      runInAction("getFile", () => {
        this.file = this.file;
      });
      this.getFiles(blobThread.id);
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
      // let threadfile = latest.files[0]
      // return threadfile.file
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
  @action async getFileContent(hash: string) {
    try {
      const bytes = await textile.files.fileData(hash);
      // const bytes = await textile.ipfs.cat(hash, key)
      runInAction("getFile", () => {
        this.file = JSON.parse(bytes);
      });
    } catch (err) {
      toast({
        title: "Error!",
        description: "Failed to get file",
        type: "error",
        time: 0
      });
      console.log(err);
    }
  }
  @action async deleteLatestFile(filename: string) {
    try {
      const filethread = this.files[filename];
      const latest = filethread.shift();
      if (!latest) {
        return;
      }

      await textile.files.ignore(latest.block);

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
