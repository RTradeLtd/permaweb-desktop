/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Group } from '../domain'
import { List, ListItem, ListItemText } from '@material-ui/core'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import Store from '../Store'
import { History } from 'history'
import { withRouter } from 'react-router-dom'
// @ts-ignore
import { alert, prompt } from 'smalltalk'

const BACKGROUND = '#f0f0f0'

const GroupsSidebar = observer(
  ({
    createGroup,
    createInvite,
    groups,
    joinGroup,
    leaveGroup,
    navigateHome,
    navigateToGroup
  }: {
    createGroup: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    createInvite: Function
    groups: Group[]
    joinGroup: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    leaveGroup: (groupHash: string) => void
    navigateHome: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    navigateToGroup: Function
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
              <button onClick={() => createInvite(groupHash)}>+</button>
            </ListItem>
          ))}
        </List>
        <List>
          <ListItem button key={'search'} onClick={joinGroup}>
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
  background: ${BACKGROUND};
  color: #696a77;
`

const WrappedGroupsSidebar = observer(
  ({ store, history }: { store: Store; groups: Group[]; history: History }) => {
    const createGroup = () => {
      history.push(`/g/create`)
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

    const createInvite = async (groupHash: string) => {
      const res = await store.groupsInvite(groupHash)
      const serialized = btoa(JSON.stringify(res))
      alert('Invite code', serialized)
    }

    const joinGroup = async () => {
      prompt('Invite code', '').then((value: string) => {
        const invite = JSON.parse(atob(value as string))
        store.groupsJoin(invite)
      })
    }

    return (
      <GroupsSidebar
        groups={store.groups}
        createGroup={createGroup}
        leaveGroup={leaveGroup}
        navigateHome={navigateHome}
        navigateToGroup={navigateToGroup}
        joinGroup={joinGroup}
        createInvite={createInvite}
      />
    )
  }
)

export default withRouter(inject('store')(WrappedGroupsSidebar as any))
