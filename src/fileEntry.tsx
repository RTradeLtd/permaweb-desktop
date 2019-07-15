import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'

export interface IFileEntry {
  id: string
  title: string
  latestEventDescription?: string
}

const FileEntry = (props: IFileEntry) => {
  const [checked, setChecked] = React.useState(false)

  const handleToggle = (event: React.MouseEvent) => {
    setChecked(!checked)
  }

  return (
    <ListItem key={props.id} role={undefined} dense button >
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={checked}
          tabIndex={-1}
          disableRipple
          onClick={handleToggle}
        />
      </ListItemIcon>
      <ListItemText id={`text-${props.id}`} primary={props.title} />
      {/* <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="Comments">
          <CommentIcon />
        </IconButton>
      </ListItemSecondaryAction> */}
    </ListItem>
  )
}

export default FileEntry