import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'

import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'

export enum CategoryType {
  NOTES = 'NOTES',
  TRASH = 'TRASH'
}

export interface Category {
  type: CategoryType,
  label: string
}

export interface SidebarProps {
  avatarImage: string
  categories: Category[]
  onOpenGroup: (group: string) => void
  onCreateGroup: () => void
}

function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

const SidebarIcon = (props: { type: CategoryType }) => {
  switch(props.type) {
    case CategoryType.NOTES:
      return <QuestionAnswerIcon />
    case CategoryType.TRASH:
      return <DeleteIcon />
    default:
      return assertNever(props.type)
  }
}

const useStyles = makeStyles(
  createStyles({
    avatar: {
      margin: 10,
      width: 60,
      height: 60,
    }
  }),
);

const Sidebar = (props: SidebarProps) => {
  const classes = useStyles();

  return (
    <div>
      <Grid container justify="flex-start" alignItems="center">
        <Avatar alt="Remy Sharp" src={props.avatarImage} className={classes.avatar} />
        <Typography>Shokunin</Typography>
      </Grid>
      <Divider />
      <List>
        {props.categories.map((c: Category, i: number) => (
          <ListItem button key={c.label} onClick={() => props.onOpenGroup(c.label)}>
            <ListItemIcon>
              <SidebarIcon type={c.type} />
            </ListItemIcon>
            <ListItemText primary={c.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button key={"create-a-group"} onClick={() => props.onCreateGroup()}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary={"Create a group"} />
          </ListItem>
      </List>
    </div>
  )
}

export default Sidebar