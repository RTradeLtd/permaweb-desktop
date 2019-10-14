/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Group } from '../domain'
import { List, ListItem, ListItemText } from '@material-ui/core'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import Store from '../Store'
import { History } from 'history'
import { withRouter } from 'react-router-dom'

const GroupsSidebar = ({
  groups,
  navigateHome,
  navigateToGroup,
  leaveGroup,
  createGroup
}: {
  groups: Group[]
  navigateHome: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  navigateToGroup: Function
  leaveGroup: Function
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
            <button
              data-key={`leave-${groupHash}`}
              onClick={() => leaveGroup(groupHash)}
            >
              -
            </button>
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

const Nav = styled.nav`
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
  padding: 0 5px;
`

const SmartGroupsSidebar = ({
  store,
  history
}: {
  store: Store
  history: History
}) => {
  const { groups, groupsDelete } = store

  const createGroup = () => {
    const rand = parseInt((Math.random() * 40).toString(), 10)
    store.groupsAdd(`G-${rand}`)
  }

  const navigateHome = () => history.push('/')

  const navigateToGroup = (groupHash: string) => history.push(`/g/${groupHash}`)

  return (
    <GroupsSidebar
      groups={groups}
      createGroup={createGroup}
      leaveGroup={groupsDelete}
      navigateHome={navigateHome}
      navigateToGroup={navigateToGroup}
    />
  )
}

export default withRouter(inject('store')(observer(SmartGroupsSidebar as any)))
