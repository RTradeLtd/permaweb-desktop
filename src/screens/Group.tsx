import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import PostCard from '../components/PostCard'
import NewPostEntryControl from '../components/NewPostEntryControl'
import Store from '../Store'
import { Post } from '../domain'

export const Group = function({
  groupHash,
  posts
}: {
  groupHash: string
  posts: Post[]
}) {
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

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-rows: auto;
  grid-gap: 20px;
`

const GroupWrap = ({
  store,
  groupHash
}: {
  store: Store
  groupHash: string
}) => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const getPosts = async () => {
      setPosts(await store.postsGetAll(groupHash))
    }

    getPosts()
  }, [store, groupHash])

  return <Group groupHash={groupHash} posts={posts} />
}

export default inject('store')(
  observer(
    ({
      store,
      match: {
        params: { groupHash }
      }
    }: {
      store: Store
      match: { params: { groupHash: string } }
    }) => <GroupWrap store={store} groupHash={groupHash} />
  )
)
