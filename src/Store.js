import { runInAction, action, configure, observable } from "mobx"
import { Textile } from "@textile/js-http-client"
import { toast } from "react-semantic-toasts"

const textile = new Textile({
  url: 'http://127.0.0.1',
  port: 40602
});

// don't allow state modifications outside actions
configure({ enforceActions: 'always' });

class Store {
  gateway = 'http://127.0.0.1:5052'
  @observable status = 'offline'
  @observable profile = {
    username: null,
    avatar: null
  };
  @observable files = {};
  @observable file = null;
  @action async getFiles() {
    try {
      const files = await textile.files.list({
        limit: 10
      })
      let threadFiles = {}

      if (files.items && files.items.length > 0) {
        files.items.forEach(item => {
          if (threadFiles[item.caption]) {
            threadFiles[item.caption].push(item)
          } else {
            threadFiles[item.caption] = [item]
          }
        });
      }

      runInAction('getFiles', () => {
        this.status = 'online'
        this.files = threadFiles
      });

    } catch (err) {
      runInAction('getStatus', () => {
        this.status = 'offline'
      });
      toast({
        title: 'Offline?',
        description: 'Looks like your Textile peer is offline 😔',
        time: 0
      });
    }
  }
  @action setFile(file) {
    runInAction('setFile', () => {
      this.file = file
    });
  }
  @action async createFile() {
    if (!this.file) {
      toast({
        title: 'Error!',
        description: 'Article text is required',
        type: 'error',
        time: 0
      });
      return;
    }

    // get article name
    let firstLine = this.file.split('</')[0]

    // remove html
    let temp = document.createElement("div")
    temp.innerHTML = `${firstLine}`
    let articleName = temp.textContent || temp.innerText || ""

    if (!articleName) {
      toast({
        title: 'Error!',
        description: 'Article title is required, it is the first line of your file',
        type: 'error',
        time: 0
      });
      return;
    }

    const THREAD_NAME = articleName
    const THREAD_KEY = articleName

    try {
      let blobThread
      const threads = await textile.threads.list()
      for (const thread of threads.items) {
        if (thread.key === THREAD_KEY) {
          blobThread = thread
        }
      }
      if (!blobThread) {
        const schemas = await textile.schemas.defaults()
        const blobSchema = schemas.blob
        delete blobSchema.use
        const addedSchema = await textile.schemas.add(blobSchema)

        blobThread = await textile.threads.add(THREAD_NAME, {
          key: THREAD_KEY,
          type: 'public',
          sharing: 'notshared',
          schema: addedSchema.hash
        })
      }

      const form = new FormData();
      const blob = new Blob([this.file], { type: 'text/plain' })
      blob.lastModifiedDate = new Date()
      blob.name = articleName
      form.append('file', blob, articleName)

      await textile.files.addFile(blobThread.id, form, articleName);
      toast({
        title: 'Success',
        description: 'Your file has been uploaded!'
      });
      runInAction('getFile', () => {
        this.file = this.file
      });
      this.getFiles();
    } catch (ex) {
      console.log('failed to add file')
      console.error(ex);
      toast({
        title: 'Error!',
        description: 'Failed to create your article 😔',
        type: 'error',
        time: 0
      });
    }
  }
  @action getFileFromName(filename) {
    try {
      let filethread = this.files[filename]
      let latest = filethread[0]
      let threadfile = latest.files[0]
      return threadfile.file
    } catch (err) {
      toast({
        title: 'Error!',
        description: 'No file found 😔',
        type: 'error',
        time: 0
      });
      return null
    }
  }
  @action async getFileContent(hash, key) {
    try {
      const bytes = await textile.ipfs.cat(hash, key)
      runInAction('getFile', () => {
        this.file = bytes
      });
    } catch (err) {
      toast({
        title: 'Error!',
        description: 'Failed to get file',
        type: 'error',
        time: 0
      });
      console.log(err)
    }
  }
  @action async deleteLatestFile(filename) {
    try {
      let filethread = this.files[filename]
      let latest = filethread.shift()

      await textile.files.ignore(latest.block)

      // no more files left
      if (filethread.length <= 0) {
        runInAction('clearFile', () => {
          delete this.files[filename]
        });
      }
      toast({
        title: 'Success',
        description: 'The latest version of your file has been deleted!'
      });
    } catch (err) {
      toast({
        title: 'Error!',
        description: 'Failed to delete file',
        type: 'error',
        time: 0
      });
      console.log(err)
    }
  }
  @action async clearFile() {
    runInAction('clearFile', () => {
      this.file = null
    });
  }
}

export default Store