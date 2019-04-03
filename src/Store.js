import { runInAction, action, configure, observable } from "mobx"
import { Textile } from "@textileio/js-http-client"
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
  @observable fileTitle = null;
  @action async getFiles() {
    try {
      const files = await textile.files.list({
        limit: 10
      })
      runInAction('getFiles', () => {
        this.status = 'online'
        this.files = files.items;
      });
    } catch(err) {
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
  @action async createArticle(articleName, articleText) {
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
      const blob = new Blob([articleText], { type: 'text/plain' })
      blob.lastModifiedDate = new Date()
      blob.name = articleName
      form.append('file', blob, articleName)

      await textile.files.addFile(blobThread.id, form, articleName);

      toast({
        title: 'Success',
        description: 'Your file has been uploaded!'
      });
      this.getFiles()
    } catch (ex) {
      console.log('failed to add file')
      console.error(ex);
    }
  }
  @action async getFile(title, hash, key) {
    const bytes = await textile.ipfs.cat(hash, key)
    runInAction('getFile', () => {
      this.fileTitle = title
      this.file = bytes
    });
  }
  @action async clearFile() {
    runInAction('getFile', () => {
      this.fileTitle = null
      this.file = null
    });
  }
}

export default Store