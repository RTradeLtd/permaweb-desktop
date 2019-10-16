import React, { useCallback } from 'react'
import { observer, inject } from 'mobx-react'
import PostCard from '../components/PostCard'
import { Post as PostType } from '../domain'
import Store from '../Store'

interface PostProps {
  post: PostType
  onPostDelete: (block: string) => void
}

export const Post = ({ post, onPostDelete }: PostProps) => {
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

  const post = store.currentPosts.find(p => p.postHash === postHash)

  if (!post) {
    throw new Error(`No post found for ${postHash}`)
  }

  return (
    <ObservedPost post={post} onPostDelete={handlePostDelete}></ObservedPost>
  )
}

export default inject('store')(WrappedPost)
