import React, { useCallback } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import {
  ListItemSecondaryAction,
  Button,
  makeStyles,
  createStyles
} from '@material-ui/core'

export interface Posts {
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

const Posts = ({
  id,
  version,
  hash,
  fileKey,
  title,
  onClick,
  onCopyLink,
  onShowHistory,
  onDelete
}: Posts) => {
  const classes = useStyles()

  const onEntryClick = useCallback(() => onClick(id, version), [
    onClick,
    id,
    version
  ])
  return (
    <ListItem key={id} role={undefined} dense button onClick={onEntryClick}>
      <ListItemText id={`text-${id}`} primary={title} />
    </ListItem>
  )
}

export default Posts
