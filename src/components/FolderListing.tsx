import React, { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'

export interface IFolderListingProps {
  children: ReactElement<any> | null
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
  }
}))

const FolderListing = (props: IFolderListingProps) => {
  const classes = useStyles()

  return <List className={classes.root}>{props.children}</List>
}

export default FolderListing
