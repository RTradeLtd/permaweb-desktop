import React, { Component } from 'react'
import Container from '@material-ui/core/Container'
import { makeStyles, Theme, createStyles, IconButton } from '@material-ui/core'
import BackIcon from '@material-ui/icons/ArrowBack'
import Store from '../Store'
import { inject } from 'mobx-react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
      margin: theme.spacing(1)
    },
    saveButton: {}
  })
)

interface ArticleTopMenuProps {
  onBackClicked: () => void
}

const ArticleTopMenu = (props: ArticleTopMenuProps) => {
  const classes = useStyles()

  return (
    <Container maxWidth="xl">
      <IconButton
        className={classes.backButton}
        aria-label="delete"
        onClick={props.onBackClicked}
      >
        <BackIcon />
      </IconButton>
    </Container>
  )
}

@inject('store')
class ArticleTopMenuStoreWrapper extends Component<{ store: Store }> {
  render() {
    return <ArticleTopMenu onBackClicked={this._handleClearFile} />
  }

  private _handleClearFile = () => {
    this.props.store.clearFile()
  }
}

export default ArticleTopMenuStoreWrapper
