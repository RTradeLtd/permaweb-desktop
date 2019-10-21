import React, { useCallback } from 'react'
import { observer, inject } from 'mobx-react'
import PostCard from '../components/PostCard'
import { Post as PostType } from '../domain'
import Store from '../Store'

interface PostProps {
  post: PostType
  onPostDelete: (block: string) => void
  onAddComment: (comment: string) => Promise<boolean>
}

export const Post = ({ post, onPostDelete, onAddComment }: PostProps) => {
  return (
    <PostCard
      post={post}
      onPostDelete={onPostDelete}
      onAddComment={onAddComment}
    />
  )
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

  const handleAddComment = async (comment: string) => {
    alert(comment)
    return true
  }

  const post = store.currentPosts.find(p => p.postHash === postHash)

  if (!post) {
    throw new Error(`No post found for ${postHash}`)
  }

  return (
    <ObservedPost
      post={post}
      onPostDelete={handlePostDelete}
      onAddComment={handleAddComment}
    ></ObservedPost>
  )
}

export default inject('store')(WrappedPost)
