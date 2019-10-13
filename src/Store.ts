import { runInAction, action, configure, observable } from 'mobx'
import { Textile, FileIndex } from '@textile/js-http-client'
import { Group } from './domain'

configure({ enforceActions: 'always' })

const SCHEMA = {
  name: 'permaweb-v0.0.3',
  mill: '/json',
  // eslint-disable-next-line @typescript-eslint/camelcase
  json_schema: {
    definitions: {},
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://example.com/root.json',
    type: 'object',
    required: ['content'],
    properties: {
      content: { type: 'string' }
    }
  }
}

const textile = new Textile({
  url: 'http://127.0.0.1',
  port: 40600
})

class Store {
  gateway: string = 'http://127.0.0.1:5052'
  schema: FileIndex | undefined = undefined
  @observable status: string = 'offline'
  @observable groups: Group[] = []

  @action
  async connect() {
    const schema = await textile.schemas.add(SCHEMA)
    // todo update this to profileGet as init
    runInAction(() => {
      this.schema = schema
      this.status = 'online'
    })
  }

  /* groups */
  @action
  async groupsGetAll() {
    const { items } = await textile.threads.list()
    const groups = items.map(({ id, name }) => ({
      groupHash: id,
      name
    }))
    runInAction(() => {
      this.groups = groups
    })
    return groups
  }

  @action
  async groupsAdd(name: string) {
    if (!this.schema) {
      throw new Error('Schema not loaded')
    }

    const group = await textile.threads.add(name, this.schema.hash)
    this.groupsGetAll()
    return group
  }

  @action
  groupsDelete = async (groupHash: string) => {
    const res = await textile.threads.remove(groupHash)
    this.groupsGetAll()
    return res
  }

  /* posts */
  async postsGetAll(groupHash: string) {
    const { items } = await textile.files.list(groupHash)
    console.log('items: ', items)
    const list = await Promise.all(
      items.map(
        async ({
          block,
          files: [
            {
              file: { hash, added }
            }
          ],
          ...rest
        }) => {
          console.log(rest)
          const serialized = await textile.file.content(hash)
          const { content } = JSON.parse(serialized)
          // content was also sserialized
          const data = JSON.parse(content)

          return {
            groupHash,
            postHash: hash,
            block,
            lastModified: added,
            author: 'Error',
            content: data,
            comments: [],
            shares: [],
            reactions: []
          }
        }
      )
    )
    console.log('list: ', list)
    return list
  }

  @action
  async postsAdd(groupHash: string, content: {}) {
    try {
      const payload = {
        content: JSON.stringify(content)
      }
      await textile.files.addFile(JSON.stringify(payload), '', groupHash)
      runInAction(() => {
        this.postsGetAll(groupHash)
      })
      return true
    } catch (err) {
      console.log('Error adding post: ', err)
    }
    return false
  }

  @action
  async postsDelete(block: string) {
    const res = await textile.files.ignore(block)
    return res
  }

  /* interactions */
}

export default Store
