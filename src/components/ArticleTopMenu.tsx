import React, { Component } from 'react'
import Container from '@material-ui/core/Container'
import { makeStyles, Theme, createStyles, IconButton } from '@material-ui/core'
import Button from '@material-ui/core/Button'
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
  onSaveClicked: () => void
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

      <Button
        variant="outlined"
        size="medium"
        className={classes.saveButton}
        onClick={props.onSaveClicked}
      >
        SAVE
      </Button>
    </Container>
  )
}

@inject('store')
class ArticleTopMenuStoreWrapper extends Component<{ store: Store }> {
  render() {
    return (
      <ArticleTopMenu
        onBackClicked={this._handleClearFile}
        onSaveClicked={this._handleSave}
      />
    )
  }

  private _handleClearFile = () => {
    this.props.store.clearFile()
  }

  private _handleSave = () => {
    this.props.store.saveEditorStateToThread()
  }
}

export default ArticleTopMenuStoreWrapper
