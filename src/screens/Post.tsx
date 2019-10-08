import React from 'react'
import { observer, inject } from 'mobx-react'
import PostCard from '../components/PostCard'

const POST_ENFORCE_INTERFACE = {
  groupHash: -1,
  postHash: -1,
  lastModified: 0,
  author: 'Error',
  content: 'Error',
  comments: [],
  shares: [],
  reactions: []
}

function usePost(postHash: string) {
  const post = {
    ...POST_ENFORCE_INTERFACE
  }
  return { post }
}

function Post({ postHash }: { postHash: string }) {
  const { post } = usePost(postHash)

  return <PostCard post={post} />
}

export default inject('store')(
  observer(({ match: { params: { postHash } } }) => (
    <Post postHash={postHash} />
  ))
)
