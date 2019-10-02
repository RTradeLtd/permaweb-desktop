import React from 'react'
import { observer, inject } from 'mobx-react'
import { Card } from '@material-ui/core'
import MOCK_FILES from '../mocks/files'

const POST_ENFORCE_INTERFACE = {
  groupId: -1,
  id: -1,
  lastModified: 0,
  author: 'Error',
  title: 'Error',
  content: 'Error',
  comments: [],
  shares: [],
  reactions: []
}

const formatDate = timeStamp => new Date(timeStamp).toLocaleString()

function usePost(postId) {
  const post = {
    ...POST_ENFORCE_INTERFACE,
    ...MOCK_FILES.find(post => post.postId === postId)
  }
  return { post }
}

function Post({ postId }) {
  const { post } = usePost(postId)
  const {
    groupId,
    author,
    lastModified,
    title,
    content,
    comments,
    shares,
    reactions
  } = post
  return (
    <Card key={postId}>
      <div>{author}</div>
      <div>{formatDate(lastModified)}</div>
      <div>{title}</div>
      <div>{content}</div>
      <div>
        <div key="comment-count">Comments {comments.length}</div>
        <div key="share-count">Shares {shares.length}</div>
        <ul key="reactions">
          Reactions:{' '}
          {reactions.map((reaction, index) => (
            <span key={index}>{reaction}</span>
          ))}
        </ul>
      </div>
      <div>
        <div>Reply to {author}</div>
        <textarea />
        <button>Send</button>
      </div>
      <ul>
        {comments.map((comment, index) => {
          return (
            <li key={index}>
              <div>{author}</div>
              <div>{content}</div>
              <div>{formatDate(lastModified)}</div>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export default inject('store')(
  observer(({ match: { params: { postId } } }) => <Post postId={postId} />)
)
