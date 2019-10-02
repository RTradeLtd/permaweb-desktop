import React from 'react'
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { Card, List } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
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

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
  },
  card: {
    margin: '20px 0'
  }
}))

function useGroup(groupId) {
  // fetch group using id
  // fetch files contents and map to list
  const list = MOCK_FILES.filter(post => groupId === post.groupId).map(
    post => ({
      ...POST_ENFORCE_INTERFACE,
      ...post
    })
  )

  return { list }
}

function Group({ groupId }) {
  const { list } = useGroup(groupId)
  const classes = useStyles()

  const handleFileOpen = () => console.log('file open')
  const handleCopyLink = () => console.log('copy link')
  const handleShowHistory = () => console.log('history')
  const handleDeleteFile = () => console.log('delete')

  return (
    <List className={classes.list}>
      {list.map(post => {
        const {
          postId,
          author,
          lastModified,
          title,
          content,
          comments,
          shares,
          reactions
        } = post
        return (
          <Card key={postId} className={classes.card}>
            <div>{author}</div>
            <div>
              <Link to={`/g/${groupId}/p/${postId}`}>
                {formatDate(lastModified)}
              </Link>
            </div>
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
      })}
    </List>
  )
}

export default inject('store')(
  observer(({ store, match: { params: { groupId } } }) => (
    <Group groupId={groupId} />
  ))
)
