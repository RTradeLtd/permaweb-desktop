import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Sidebar, { Category } from './sidebar'
import FolderListing from './folderListing'
import FileEntry from './fileEntry'

export interface FileDescriptor {
  id: string
  title: string
  latestEventDescription?: string
}

export interface IScreenProps {
  avatarImage: string
  categories: Category[]
  folderListing: FileDescriptor[]
  onOpenGroup: (group: string) => void
  onCreateGroup: () => void
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
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
    backgroundColor: theme.palette.background.paper
  }
}));

const Screen = (props: IScreenProps) => {
  const classes = useStyles();

  const fileEntries: any = props.folderListing.map(f => {
    return (<FileEntry {...f} />) as any
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
    </div>
  )
}

export default Screen