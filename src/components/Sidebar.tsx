import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'

export enum CategoryType {
  NOTES = 'NOTES',
  MYPOSTS = 'MY POSTS',
  TRASH = 'TRASH'
}

export interface Category {
  type: CategoryType
  label: string
  id: string
}

export interface SidebarProps {
  avatarImage: string
  username: string
  categories: Category[]
  onOpenGroup: (group: string, id: string) => void
  onCreateGroup: () => void
}

function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x)
}

const SidebarIcon = (props: { type: CategoryType }) => {
  switch (props.type) {
    case CategoryType.NOTES:
      return <QuestionAnswerIcon />
    case CategoryType.TRASH:
      return <DeleteIcon />
    case CategoryType.MYPOSTS:
      return <QuestionAnswerIcon />
    default:
      return assertNever(props.type)
  }
}

const useStyles = makeStyles(theme =>
  createStyles({
    avatar: {
      margin: 10,
      width: 60,
      height: 60
    },
    sidebar: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary
    }
  })
)

const Sidebar = ({
  username,
  avatarImage,
  categories,
  onOpenGroup,
  onCreateGroup
}: SidebarProps) => {
  const classes = useStyles()
  return (
    <div className={classes.sidebar}>
      <Grid container justify="flex-start" alignItems="center">
        <Avatar alt="Remy Sharp" src={avatarImage} className={classes.avatar} />
        <Typography>{username}</Typography>
      </Grid>
      <Divider />
      <List>
        {categories.map(({ label, type, id }: Category) => (
          <ListItem
            button
            key={label}
            disabled={label === 'Trash'}
            onClick={() => onOpenGroup(label, id)}
          >
            <ListItemIcon>
              <SidebarIcon type={type} />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem
          button
          disabled
          key={'create-a-group'}
          onClick={() => onCreateGroup()}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary={'Create a group'} />
        </ListItem>
      </List>
    </div>
  )
}

export default Sidebar
