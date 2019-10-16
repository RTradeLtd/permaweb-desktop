import React, { useCallback } from 'react'
import { observer, inject } from 'mobx-react'
import PostCard from '../components/PostCard'
import { Post as PostType } from '../domain'
import Store from '../Store'

const POST_ENFORCE_INTERFACE = {
  groupHash: '-1',
  postHash: '-1',
  block: '123',
  lastModified: '',
  author: 'Error',
  content: 'Error',
  comments: [],
  shares: [],
  reactions: []
}

function usePost(postHash: string) {
  const post: PostType = {
    ...POST_ENFORCE_INTERFACE
  }

  return { post }
}

interface PostProps {
  postHash: string
  onPostDelete: (block: string) => void
}

export const Post = ({ postHash, onPostDelete }: PostProps) => {
  const { post } = usePost(postHash)

  return <PostCard post={post} onPostDelete={onPostDelete} />
}

const ObservedPost = observer(Post)

const WrappedPost = ({
  store,
  match: {
    params: { postHash }
  }
}: {
  store: Store
  match: { params: { postHash: string } }
}) => {
  const handlePostDelete = useCallback(
    (block: string) => {
      return store.postsDelete(block)
    },
    [store]
  )

  return (
    <ObservedPost
      postHash={postHash}
      onPostDelete={handlePostDelete}
    ></ObservedPost>
  )
}

export default inject('store')(WrappedPost)
