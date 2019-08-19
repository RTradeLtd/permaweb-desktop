import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'

export interface FolderListingProps {
  children: JSX.Element[] | null
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
  }
}))

const FolderListing = (props: FolderListingProps) => {
  const classes = useStyles()

  return <List className={classes.root}>{props.children}</List>
}

export default FolderListing
