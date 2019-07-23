import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Sidebar, { Category } from './sidebar'
import FolderListing from './folderListing'
import FileEntry from './fileEntry'
import AddIcon from '@material-ui/icons/Add'
import { Fab, Zoom } from '@material-ui/core'

export interface FileDescriptor {
  id: string
  version: number
  title: string
  latestEventDescription?: string
}

export interface IScreenProps {
  avatarImage: string
  categories: Category[]
  folderListing: FileDescriptor[]
  onOpenGroup: (group: string) => void
  onCreateGroup: () => void
  onFileOpen: (fileId: string, version: number) => void
  onAddFile: () => void
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  drawer: {
    // width: drawerWidth,
    // flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  main: {
    width: '100%',
    height: '100%',
    paddingLeft: '1rem',
    backgroundColor: theme.palette.background.paper
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

const Screen = (props: IScreenProps) => {
  const classes = useStyles()
  const theme = useTheme()

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const fileEntries: any = props.folderListing.map(f => {
    return (<FileEntry key={f.id} {...f} onClick={props.onFileOpen} />) as any
  })

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={true}
        classes={{
          paper: classes.drawerPaper,
        }}>
        <Sidebar
          avatarImage={props.avatarImage}
          categories={props.categories}
          onOpenGroup={props.onOpenGroup}
          onCreateGroup={props.onCreateGroup} />
      </Drawer>

      <main className={classes.main}>
        <FolderListing>
          {fileEntries}
        </FolderListing>
      </main>

      <Zoom
        in={true}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${transitionDuration.exit}ms`,
        }}
        unmountOnExit
      >
        <Fab
          aria-label={"Add Note"}
          className={classes.fab}
          color={"secondary"}
          size={'large'}
          onClick={() => props.onAddFile()}>
          <AddIcon />
        </Fab>
      </Zoom>
    </div>
  )
}

export default Screen