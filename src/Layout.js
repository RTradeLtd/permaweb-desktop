import React from 'react'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import {
  AppBar,
  ListItemText,
  Divider,
  List,
  ListItem
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const DRAWER_WIDTH = 240
const APPBAR_HEIGHT = 90
const BACKGROUND = '#3fb55e'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  title: {
    height: APPBAR_HEIGHT,
    background: BACKGROUND
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: DRAWER_WIDTH,
      flexShrink: 0
    }
  },
  appBar: {
    background: BACKGROUND,
    height: APPBAR_HEIGHT,
    marginLeft: DRAWER_WIDTH,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${DRAWER_WIDTH}px)`
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  drawerPaper: {
    width: DRAWER_WIDTH
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: APPBAR_HEIGHT
  }
}))

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
  const {
    createFile,
    createGroup,
    groups,
    members,
    navigateHome,
    navigateToGroup,
    saveFile
  } = useLayout({
    history
  })
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <div>Group name</div>
        <div>
          <div>90</div>
          <div>
            {members.map((member, i) => {
              return <img src="" alt="" key={i} />
            })}
          </div>
          <div>Share</div>
          <div>Edit</div>
        </div>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <h1 className={classes.title}>Permaweb</h1>
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
        <Divider />
        <List>
          <ListItem button key={'search'} onClick={navigateHome}>
            <ListItemText primary={'Find people or groups'} />
          </ListItem>
          <ListItem button key={'create-group'} onClick={navigateHome}>
            <ListItemText primary={'Create a groupt'} />
          </ListItem>
        </List>
        <Divider />
        <div>
          <img src="" alt="avatar" />
          <div>Shokunin</div>
          <div>Edit</div>
        </div>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  )
}

export default inject('store')(observer(withRouter(Layout)))
