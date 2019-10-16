import React, { useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import PostCard from '../components/PostCard'
import NewPostEntryControl from '../components/NewPostEntryControl'
import Store from '../Store'
import { Post } from '../domain'

export const Group = ({
  posts,
  onPostClicked,
  onPostDelete
}: {
  posts: Post[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPostClicked: (editorState: any) => Promise<boolean>
  onPostDelete: (block: string) => void
}) => {
  return (
    <div>
      <NewPostEntryControl onPostClicked={onPostClicked} />
      <List>
        {posts.map(post => (
          <PostCard
            key={post.postHash}
            post={post}
            onPostDelete={onPostDelete}
          />
        ))}
      </List>
    </div>
  )
}

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-rows: auto;
  grid-gap: 20px;
`

const ObservedGroup = observer(Group)

const WrappedGroup = ({
  store,
  match: {
    params: { groupHash }
  }
}: {
  store: Store
  match: { params: { groupHash: string } }
}) => {
  useEffect(() => {
    store.postsLoad(groupHash)
  }, [store, groupHash])

  const handlePostClicked = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (editorState: any): Promise<boolean> => {
      const res = await store.postsAdd(groupHash, editorState)

      return !!res
    },
    [groupHash, store]
  )

  const handlePostDelete = useCallback(
    (block: string) => {
      return store.postsDelete(block)
    },
    [store]
  )

  return (
    <ObservedGroup
      key={groupHash}
      posts={store.currentPosts}
      onPostClicked={handlePostClicked}
      onPostDelete={handlePostDelete}
    />
  )
}

export default inject('store')(WrappedGroup)
