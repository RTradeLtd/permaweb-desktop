import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Button } from 'semantic-ui-react'

@inject('store') @observer
class DeleteButton extends Component {
  deleteFile(id) {
    this.props.store.deleteFile(id)
  }
  render() {
    const { id } = this.props

    return (
      <Button size='mini' onClick={() => { this.deleteFile(id) }}>Delete</Button>
    );
  }
}

export default DeleteButton
