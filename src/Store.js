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
  @observable articleText = "";
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
  @action setArticleText (articleText) {
    runInAction('setArticleText', () => {
      this.articleText = articleText
    });
  }
  @action async createArticle(articleName) {
    if (!this.articleText) {
      toast({
        title: 'Error!',
        description: 'Article text is required',
        type: 'error',
        time: 0
      });
      return;
    }

    if (!articleName) {
      toast({
        title: 'Error!',
        description: 'Article title is required',
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
      const blob = new Blob([this.articleText], { type: 'text/plain' })
      blob.lastModifiedDate = new Date()
      blob.name = articleName
      form.append('file', blob, articleName)

      await textile.files.addFile(blobThread.id, form, articleName);
      toast({
        title: 'Success',
        description: 'Your file has been uploaded!'
      });
      runInAction('getFile', () => {
        this.fileTitle = articleName
        this.file = this.articleText
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
  @action getFileFromThread(thread) {
    if (thread.files &&
      thread.files[0] &&
      thread.files[0].file &&
      thread.files[0].file.hash &&
      thread.files[0].file.key) {
        return thread.files[0].file
    } else {
      toast({
        title: 'Error!',
        description: 'No file found 😔',
        type: 'error',
        time: 0
      });
      return null
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
    runInAction('clearFile', () => {
      this.fileTitle = null
      this.file = null
    });
  }
}

export default Store