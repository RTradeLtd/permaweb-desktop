import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { ListItemText, List, ListItem } from '@material-ui/core'

const DRAWER_WIDTH = 240
const APPBAR_HEIGHT = 80
const BACKGROUND = '#3fb55e'

function useLayout({ history }) {
  const navigateHome = () => history.push('/')
  const navigateToGroup = groupId => history.push(`/g/${groupId}`)
  const createFile = () => console.log('Layout: create file')
  const saveFile = () => console.log('Layout: save')
  const createGroup = () => console.log('Layout: create group')
  const members = [1, 2, 3, 4, 5]
  const groups = [{ id: '1', name: 'Group 1' }, { id: '2', name: 'Group 2' }]

  return {
    createFile,
    createGroup,
    groups,
    members,
    navigateHome,
    navigateToGroup,
    saveFile
  }
}

const Layout = ({ store, children, history }) => {
  const { groups, members, navigateHome, navigateToGroup } = useLayout({
    history
  })

  return (
    <Section>
      <AppBar>
        <Title>
          <Img
            src="https://picsum.photos/seed/picsum/50/50"
            alt="Permaweb logo"
          />{' '}
          Permaweb
        </Title>
        <Bar>
          <h2>Group name</h2>
          <Info>
            <div>90</div>
            <Members maxCount={5}>
              {members.map((member, i) => {
                return (
                  <Img
                    src="https://picsum.photos/seed/picsum/30/30"
                    alt=""
                    key={i}
                  />
                )
              })}
            </Members>
            <div>Share</div>
            <div>Edit</div>
          </Info>
        </Bar>
      </AppBar>
      <Wrap>
        <Nav>
          <List>
            <ListItem button key={'home'} onClick={navigateHome}>
              <ListItemText primary={'Home'} />
            </ListItem>
            {groups.map(({ id, name }) => (
              <ListItem button key={id} onClick={() => navigateToGroup(id)}>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
          <List>
            <ListItem button key={'search'} onClick={navigateHome}>
              <ListItemText primary={'Find people or groups'} />
            </ListItem>
            <ListItem button key={'create-group'} onClick={navigateHome}>
              <ListItemText primary={'Create a groupt'} />
            </ListItem>
          </List>
          <Profile>
            <Img src="https://picsum.photos/seed/picsum/30/30" alt="avatar" />
            <div>Shokunin</div>
            <div>Edit</div>
          </Profile>
        </Nav>
        <Main>{children}</Main>
      </Wrap>
    </Section>
  )
}

const AppBar = styled.header`
  display: grid;
  grid-template-columns: ${DRAWER_WIDTH}px 1fr;
  height: ${APPBAR_HEIGHT}px;
  background: ${BACKGROUND};
`

const Wrap = styled.div`
  display: grid;
  grid-template-columns: ${DRAWER_WIDTH}px 1fr;
`

const Main = styled.main`
  height: calc(100vh - ${APPBAR_HEIGHT}px);
  overflow: auto;
  padding: 20px;
  background: #f0f0f0;
`

const Nav = styled.nav`
  height: calc(100vh - ${APPBAR_HEIGHT}px);
  display: grid;
  grid-template-rows: 1fr auto 80px;
  padding: 0 5px;
`

const Title = styled.h1`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
  align-items: center;
  padding: 0 20px;
`

const Img = styled.img`
  border-radius: 50%;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
`

const Info = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-gap: 5px;
  align-items: center;
`

const Members = styled.div`
  display: grid;
  grid-template-columns: ${({ maxCount }) => `repeat(${maxCount}, auto)`};
  grid-gap: 5px;
`

const Profile = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: 10px;
  align-items: center;
  padding: 0 10px;
`

export default inject('store')(observer(withRouter(Layout)))
