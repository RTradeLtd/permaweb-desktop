import React, { useEffect } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import PostCard from '../components/PostCard'
import NewPostEntryControl from '../components/NewPostEntryControl'
import Store from '../Store'
import { Post } from '../domain'

export const Group = observer(
  ({ groupHash, posts }: { groupHash: string; posts: Post[] }) => {
    return (
      <div>
        <NewPostEntryControl key={groupHash} groupHash={groupHash} />
        <List>
          {posts.map(post => (
            <PostCard key={post.postHash} post={post} />
          ))}
        </List>
      </div>
    )
  }
)

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-rows: auto;
  grid-gap: 20px;
`

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

  return <Group groupHash={groupHash} posts={store.currentPosts} />
}

export default inject('store')(WrappedGroup)
