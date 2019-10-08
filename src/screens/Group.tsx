import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import PostCard from '../components/PostCard'
import NewPostEntryControl from '../components/NewPostEntryControl'
import Store from '../Store'

function useGroup({ groupHash, store }: { groupHash: string; store: Store }) {
  // @ts-ignore
  const [list, setList] = useState([])

  useEffect(() => {
    const getList = async () => {
      // @ts-ignore
      setList(await store.postsGetAll(groupHash))
    }
    getList()
  }, [groupHash])
  // @ts-ignore
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
        // @ts-ignore
        {list.map(post => (
          // @ts-ignore
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
