import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Button } from 'semantic-ui-react'

@inject('store') @observer
class DeleteButton extends Component {
  deleteLatestFile(id) {
    this.props.store.deleteLatestFile(id)
  }
  render() {
    const { id } = this.props
    const { files } = this.props.store

    if (files[id] && files[id].length > 1) {
      return (
        <Button size='mini' onClick={() => { this.deleteLatestFile(id) }}>Undo</Button>
      );
    }

    return (
      <Button size='mini' onClick={() => { this.deleteLatestFile(id) }}>Delete</Button>
    );
  }
}

export default DeleteButton
