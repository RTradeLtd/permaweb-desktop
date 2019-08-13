import React, { useCallback } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import {
  ListItemSecondaryAction,
  Button,
  makeStyles,
  createStyles
} from '@material-ui/core'

export interface IFileEntry {
  id: string
  version: number
  hash: string
  fileKey: string
  title: string
  latestEventDescription?: string
  onClick: (fileId: string, version: number) => void
  onCopyLink: (hash: string | undefined, key: string | undefined) => void
  onShowHistory: (fileId: string, version: number) => void
  onDelete: (fileId: string) => void
}

const useStyles = makeStyles(theme =>
  createStyles({
    button: {
      margin: theme.spacing(1)
    },
    input: {
      display: 'none'
    }
  })
)

const FileEntry = ({
  id,
  version,
  hash,
  fileKey,
  title,
  onClick,
  onCopyLink,
  onShowHistory,
  onDelete
}: IFileEntry) => {
  const classes = useStyles()
  const [checked, setChecked] = React.useState(false)

  const handleToggle = (event: React.MouseEvent) => {
    setChecked(!checked)
  }

  const onEntryClick = useCallback(() => onClick(id, version), [
    onClick,
    id,
    version
  ])
  const onEntryCopyLink = useCallback(() => onCopyLink(hash, fileKey), [
    onCopyLink,
    hash,
    fileKey
  ])
  const onEntryShowHistory = useCallback(() => onShowHistory(id, version), [
    onShowHistory,
    id
  ])
  const onEntryDelete = useCallback(() => onDelete(id), [onDelete, id])

  return (
    <ListItem key={id} role={undefined} dense button onClick={onEntryClick}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={checked}
          tabIndex={-1}
          disableRipple
          onClick={handleToggle}
          disabled
        />
      </ListItemIcon>
      <ListItemText id={`text-${id}`} primary={title} />
      <ListItemSecondaryAction>
        <Button
          variant="outlined"
          className={classes.button}
          onClick={onEntryCopyLink}
        >
          Copy Link
        </Button>
        {/* <Button variant="outlined" className={classes.button} onClick={onEntryShowHistory} >
          Show History
        </Button> */}
        <Button
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={onEntryDelete}
        >
          Delete
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default FileEntry
