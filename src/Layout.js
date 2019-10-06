import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { ListItemText, List, ListItem } from '@material-ui/core'

const DRAWER_WIDTH = 240
const HEADER_HEIGHT = 80
const FOOTER_HEIGHT = 60
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
      <Header>
        <Title>
          <Img
            src="https://picsum.photos/seed/picsum/50/50"
            alt="Permaweb logo"
          />{' '}
          Permaweb
        </Title>
        <Bar>
          <Sub>Group name</Sub>
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
      </Header>
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
        </Nav>
        <Main>{children}</Main>
      </Wrap>
      <Footer>
        <Profile>
          <Img src="https://picsum.photos/seed/picsum/30/30" alt="avatar" />
          <div>Shokunin</div>
          <div>Edit</div>
        </Profile>
        <Copyright>© Permaweb</Copyright>
      </Footer>
    </Section>
  )
}

/* section */
const Section = styled.section`
  display: grid;
  grid-template-rows: ${HEADER_HEIGHT}px 1fr ${FOOTER_HEIGHT}px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`

const Header = styled.header`
  display: grid;
  grid-template-columns: ${DRAWER_WIDTH}px 1fr;
  height: ${HEADER_HEIGHT}px;
  background: ${BACKGROUND};
`

const Wrap = styled.div`
  display: grid;
  grid-template-columns: ${DRAWER_WIDTH}px 1fr;
  overflow: auto;
`

const Footer = styled.footer`
  display: grid;
  grid-template-columns: ${DRAWER_WIDTH}px 1fr;
  height: ${FOOTER_HEIGHT}px;
  background: ${BACKGROUND};
`

/* header */
const Title = styled.h1`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
  align-items: center;
  height: ${HEADER_HEIGHT}px;
  padding: 0 20px;
`

const Bar = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  height: ${HEADER_HEIGHT}px;
  padding: 0 10px;
`

const Sub = styled.h2`
  padding: 0;
  margin: 0;
`

const Info = styled.div`
  display: inline-grid;
  grid-template-columns: auto auto auto auto;
  grid-gap: 5px;
  align-items: center;
  margin-left: auto;
`

const Members = styled.div`
  display: grid;
  grid-template-columns: ${({ maxCount }) => `repeat(${maxCount}, auto)`};
  grid-gap: 5px;
`

/* wrap */
const Main = styled.main`
  height: 100%;
  overflow: auto;
  padding: 20px;
  background: #f0f0f0;
`

const Nav = styled.nav`
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
  padding: 0 5px;
`

/* footer */
const Profile = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: 10px;
  align-items: center;
  padding: 0 10px;
`

const Copyright = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 20px;
`

/* common */
const Img = styled.img`
  border-radius: 50%;
`

export default inject('store')(observer(withRouter(Layout)))
