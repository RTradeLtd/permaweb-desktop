import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import PostCard from '../components/PostCard'
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

  const handleFileOpen = () => console.log('file open')
  const handleCopyLink = () => console.log('copy link')
  const handleShowHistory = () => console.log('history')
  const handleDeleteFile = () => console.log('delete')

  return (
    <List>
      {list.map(post => (
        <PostCard post={post} />
      ))}
    </List>
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

export default inject('store')(
  observer(({ store, match: { params: { groupId } } }) => (
    <Group groupId={groupId} />
  ))
)
