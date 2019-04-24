import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Button } from 'semantic-ui-react'

@inject('store') @observer
class DeleteButton extends Component {
  deleteLatestFile (filename) {
    this.props.store.deleteLatestFile(filename)
  }
  render () {
    const { filename } = this.props
    const { files } = this.props.store

    if (files[filename].length > 1) {
      return (
        <Button size='mini' onClick={() => { this.deleteLatestFile(filename) }}>Undo</Button>
      );
    }

    return (
      <Button size='mini' onClick={() => { this.deleteLatestFile(filename) }}>Delete</Button>
    );
  }
}

export default DeleteButton
