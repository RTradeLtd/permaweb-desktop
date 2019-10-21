import React, { useCallback } from 'react'
import styled from 'styled-components'
import SlateEditor from './SlateEditor'
import { Value } from 'slate'
import { Link } from 'react-router-dom'
import { Post } from '../domain'
import CommentComposer from './CommentComposer'

const formatDate = (timeStamp: string) => new Date(timeStamp).toLocaleString()

interface PostCardProps {
  post: Post
  onPostDelete: (block: string) => void
  onAddComment: (postHash: string, comment: string) => Promise<boolean>
}

function PostCard({
  post: {
    groupHash,
    postHash,
    block,
    author,
    lastModified,
    content,
    comments,
    shares,
    reactions
  },
  onPostDelete,
  onAddComment
}: PostCardProps) {
  const handleDeletePost = useCallback(() => {
    return onPostDelete(block)
  }, [onPostDelete, block])

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
        <button onClick={handleDeletePost}>-</button>
      </Header>
      <PostBorderContainer>
        <PostBody>
          <SlateEditor value={Value.fromJSON(content)} readOnly />
        </PostBody>
      </PostBorderContainer>
      <PostBorderContainer>
        <Interactions>
          <Reactions key="reactions">
            {reactions.map((reaction, index) => (
              <Reaction key={index}>
                <span>{reaction.symbol}</span>
                <span>{reaction.count}</span>
              </Reaction>
            ))}
            <Reaction key={'add-reaction'}>
              <span>+</span>
              <span>React</span>
            </Reaction>
          </Reactions>
          <Reactions>
            <Reaction key="comment-count">
              <i className={`fas fa-comment-alt`}></i>
              <span>{comments.length} Comments</span>
            </Reaction>
            <Reaction key="share-count">
              <i className="fas fa-share-square"></i>
              <span>{shares.length} Shared</span>
            </Reaction>
          </Reactions>
        </Interactions>
      </PostBorderContainer>
      <Comments>
        <div>
          <CommentComposer
            postHash={postHash}
            author={author}
            onAddComment={onAddComment}
          />
        </div>
        <CommentList>
          {comments.map(({ author, body, date }, index) => {
            return (
              <Comment key={index}>
                <Img
                  src="https://picsum.photos/seed/picsum/20/20"
                  alt={author}
                />
                <div>{author}</div>
                <CommentContent>{body}</CommentContent>
                <div>{formatDate(date)}</div>
              </Comment>
            )
          })}
        </CommentList>
      </Comments>
    </Card>
  )
}

// TODO: pull this from theme
const backgroundColor = '#e9ebee'

const Card = styled.li`
  display: grid;
  grid-template-columns: auto;
  grid-gap: 0px;
  border-radius: 5px;
  background: #fff;
  box-shadow: 1px 1px 5px -2px rgba(0, 0, 0, 0.1);
`

const Header = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-gap: 10px;
  align-items: center;
  padding: 15px;
`

const Author = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
  align-items: center;
`

const PostBorderContainer = styled.div`
  padding: 15px;
  border-bottom: 2px solid ${backgroundColor};
`

const PostBody = styled.div``

const Img = styled.img`
  border-radius: 50%;
`

const When = styled.div`
  text-align: right;
`

const Interactions = styled.div`
  display: flex;
  justify-content: space-between;
`

const Reactions = styled.ul`
  display: inline-grid;
  grid-template-columns: auto auto auto;
  grid-gap: 10px;
  width: fit-content;
  list-style: none;
  padding-inline-start: 10px;
  padding-inline-end: 10px;
  margin-block-start: 0px;
  margin-block-end: 0px;
`

const Reaction = styled.li`
  background: #f5f6f7;
  padding: 5px 10px 5px 10px;
  border-radius: 15px;
  height: 28px;
  color: #4267b2;
  span:first-of-type {
    margin-right: 8px;
  }
  i {
    padding-left: 3px;
    padding-top: 7px;
    margin-right: 8px;
  }
`

const Comments = styled.div`
  padding: 15px;
`

const CommentList = styled.ul`
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

export default PostCard
