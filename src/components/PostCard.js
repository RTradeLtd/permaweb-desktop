import React from 'react'
import styled from 'styled-components'
import SlateEditor from './SlateEditor'
import { Value } from 'slate'
import { observer, inject } from 'mobx-react'
import { Link } from 'react-router-dom'

const formatDate = timeStamp => new Date(timeStamp).toLocaleString()

function usePost({
  post: {
    groupHash,
    postHash,
    author,
    lastModified,
    content,
    comments,
    shares,
    reactions,
    block
  },
  store
}) {
  const deletePost = () => store.postsDelete(block)

  return {
    groupHash,
    postHash,
    author,
    lastModified,
    content,
    comments,
    shares,
    reactions,
    deletePost
  }
}

function PostCard({ store, post }) {
  const {
    groupHash,
    postHash,
    author,
    lastModified,
    content,
    comments,
    shares,
    reactions,
    deletePost
  } = usePost({ store, post })

  return (
    <Card key={postHash}>
      <Header>
        <Author>
          <Img src="https://picsum.photos/seed/picsum/30/30" alt={author} />
          <div>{author}</div>
        </Author>
        <When>
          <Link to={`/g/${groupHash}/p/${postHash}`}>
            {formatDate(lastModified)}
          </Link>
        </When>
      </Header>
      <div>
        <SlateEditor value={Value.fromJSON(content)} readOnly />
      </div>
      <Interactions>
        <div key="comment-count">Comments {comments.length}</div>
        <div key="share-count">Shares {shares.length}</div>
        <Reactions key="reactions">
          Reactions:{' '}
          {reactions.map((reaction, index) => (
            <span key={index}>{reaction}</span>
          ))}
        </Reactions>
      </Interactions>
      <div>
        <div>Reply to {author}</div>
        <textarea />
        <button>Send</button>
      </div>
      <Comments>
        {comments.map(({ author, content, lastModified }, index) => {
          return (
            <Comment key={index}>
              <Img src="https://picsum.photos/seed/picsum/20/20" alt={author} />
              <div>{author}</div>
              <CommentContent>{content}</CommentContent>
              <div>{formatDate(lastModified)}</div>
            </Comment>
          )
        })}
      </Comments>
      <button onClick={deletePost}>-</button>
    </Card>
  )
}

const Card = styled.li`
  display: grid;
  grid-template-columns: auto;
  grid-gap: 20px;
  border-radius: 5px;
  padding: 15px;
  background: #fff;
  box-shadow: 1px 1px 5px -2px rgba(0, 0, 0, 0.1);
`

const Header = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-gap: 10px;
  align-items: center;
`

const Author = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
  align-items: center;
`

const Img = styled.img`
  border-radius: 50%;
`

const When = styled.div`
  text-align: right;
`

const Interactions = styled.div`
  display: inline-grid;
  grid-template-columns: auto auto auto;
  grid-gap: 10px;
  width: fit-content;
`

const Reactions = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`

const Comments = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: grid;
  grid-template-rows: auto;
  grid-gap: 10px;
`

const Comment = styled.li`
  display: grid;
  grid-template-columns: auto auto auto 1fr;
  grid-gap: 10px;
  align-items: center;
`

const CommentContent = styled.div`
  padding: 2px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`

export default inject('store')(observer(props => <PostCard {...props} />))
