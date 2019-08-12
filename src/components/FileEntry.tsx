import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'

export interface IFileEntry {
  id: string
  version: number
  title: string
  latestEventDescription?: string
  onClick: (fileId: string, version: number) => void
}

const FileEntry = ({ id, version, title, onClick }: IFileEntry) => {
  const [checked, setChecked] = React.useState(false)

  const handleToggle = (event: React.MouseEvent) => {
    setChecked(!checked)
  }

  return (
    <ListItem key={id} role={undefined} dense button onClick={() => onClick(id, version)}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={checked}
          tabIndex={-1}
          disableRipple
          onClick={handleToggle}
        />
      </ListItemIcon>
      <ListItemText id={`text-${id}`} primary={title} />
    </ListItem>
  )
}

export default FileEntry