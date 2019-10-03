import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import PostCard from '../components/PostCard'
import MOCK_FILES from '../mocks/files.json'
import NewPostEntryControl from '../components/NewPostEntryControl'

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

function useGroup(groupId: string) {
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

export const Group = function({ groupId }: { groupId: string }) {
  const { list } = useGroup(groupId)

  return (
    <div>
      <NewPostEntryControl key={groupId} />
      <List>
        {list.map(post => (
          <PostCard key={post.id} post={post} />
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

export default inject('store')(
  observer(({ match: { params: { groupId } } }) => <Group groupId={groupId} />)
)
