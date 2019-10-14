import React from 'react'
import { Group } from '../domain'
import { List, ListItem, ListItemText } from '@material-ui/core'
import styled from 'styled-components'

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

export default GroupsSidebar
