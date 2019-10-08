import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import PostCard from '../components/PostCard'
import NewPostEntryControl from '../components/NewPostEntryControl'
import Store from '../Store'
import { Post } from '../domain'

function useGroup({ groupHash, store }: { groupHash: string; store: Store }) {
  const [list, setList] = useState<Post[]>([])

  useEffect(() => {
    const getList = async () => {
      setList(await store.postsGetAll(groupHash))
    }

    getList()
  }, [groupHash])

  return { list }
}

export const Group = function({
  groupHash,
  store
}: {
  groupHash: string
  store: Store
}) {
  const { list } = useGroup({ store, groupHash })

  return (
    <div>
      <NewPostEntryControl key={groupHash} groupHash={groupHash} />
      <List>
        {list.map(post => (
          <PostCard key={post.postHash} post={post} />
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
  observer(({ store, match: { params: { groupHash } } }) => (
    <Group store={store} groupHash={groupHash} />
  ))
)
