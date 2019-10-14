/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Group } from '../domain'
import { List, ListItem, ListItemText } from '@material-ui/core'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import Store from '../Store'
import { History } from 'history'
import { withRouter } from 'react-router-dom'

const GroupsSidebar = observer(
  ({
    groups,
    navigateHome,
    navigateToGroup,
    leaveGroup,
    createGroup
  }: {
    groups: Group[]
    navigateHome: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    navigateToGroup: Function
    leaveGroup: (groupHash: string) => void
    createGroup: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  }) => {
    return (
      <Nav>
        <List>
          <ListItem button key={'home'} onClick={navigateHome}>
            <ListItemText primary={'Home'} />
          </ListItem>
          {groups.map(({ groupHash, name }: Group) => (
            <ListItem
              key={groupHash}
              button
              onClick={() => navigateToGroup(groupHash)}
            >
              <ListItemText primary={name} />
              <button onClick={() => leaveGroup(groupHash)}>-</button>
            </ListItem>
          ))}
        </List>
        <List>
          <ListItem button key={'search'} onClick={navigateHome}>
            <ListItemText primary={'Find people or groups'} />
          </ListItem>
          <ListItem button key={'create-group'} onClick={createGroup}>
            <ListItemText primary={'Create a group'} />
          </ListItem>
        </List>
      </Nav>
    )
  }
)

const Nav = styled.nav`
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
  padding: 0 5px;
`

const WrappedGroupsSidebar = observer(
  ({ store, history }: { store: Store; groups: Group[]; history: History }) => {
    const createGroup = () => {
      const rand = parseInt((Math.random() * 40).toString(), 10)
      store.groupsAdd(`G-${rand}`)
    }

    const navigateHome = () => history.push('/')

    const navigateToGroup = async (groupHash: string) => {
      await store.postsLoad(groupHash)
      history.push(`/g/${groupHash}`)
    }

    const leaveGroup = async (groupHash: string) => {
      await store.groupsDelete(groupHash)
      history.push('/')
    }

    return (
      <GroupsSidebar
        groups={store.groups}
        createGroup={createGroup}
        leaveGroup={leaveGroup}
        navigateHome={navigateHome}
        navigateToGroup={navigateToGroup}
      />
    )
  }
)

export default withRouter(inject('store')(WrappedGroupsSidebar as any))
