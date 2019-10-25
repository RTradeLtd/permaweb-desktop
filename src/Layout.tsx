import React, { useEffect } from 'react'
import styled from 'styled-components'
import { inject } from 'mobx-react'
import Store from './Store'
import { Profile as ProfileType } from './domain'

import GroupsSidebar from './components/GroupsSidebar'
import Avatar from './components/Avatar'

const DRAWER_WIDTH = 240
const HEADER_HEIGHT = 80
const FOOTER_HEIGHT = 60
const PRIMARY = '#4267b2'
const BACKGROUND = '3578E5'

interface LayoutProps {
  profile: ProfileType
}

export const Layout: React.FC<LayoutProps> = ({ profile, children }) => {
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
          <Info>
            <div>Share</div>
            <div>Edit</div>
          </Info>
        </Bar>
      </Header>
      <Content>
        <GroupsSidebar />
        <Main>{children}</Main>
      </Content>
      <Footer>
        <Profile>
          <Avatar author={profile.name} />
          <div>{profile.name}</div>
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

const Content = styled.div`
  display: grid;
  grid-template-columns: ${DRAWER_WIDTH}px 1fr;
  overflow: auto;
`

const Footer = styled.footer`
  display: grid;
  grid-template-columns: ${DRAWER_WIDTH}px 1fr;
  height: ${FOOTER_HEIGHT}px;
  background: ${PRIMARY};
  color: white;
`

/* header */
const Title = styled.h1`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
  align-items: center;
  height: ${HEADER_HEIGHT}px;
  padding: 0 20px;
  background: ${PRIMARY};
  color: white;
`

const Bar = styled.div`
  display: grid;
  grid-template-columns: auto;
  align-items: center;
  height: ${HEADER_HEIGHT}px;
  padding: 0 10px;
  background: ${PRIMARY};
  color: white;
`

const Info = styled.div`
  display: inline-grid;
  grid-template-columns: auto auto auto auto;
  grid-gap: 5px;
  align-items: center;
  margin-left: auto;
`

/* content */

const Main = styled.main`
  height: 100%;
  overflow: auto;
  padding: 20px;
  background: #f0f0f0;
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

const LayoutWrapper: React.FC<{ store: Store }> = ({ store, children }) => {
  useEffect(() => {
    store.groupsGetAll()
  }, [store])

  return <Layout profile={store.profile}>{children}</Layout>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default inject('store')(LayoutWrapper as any)
