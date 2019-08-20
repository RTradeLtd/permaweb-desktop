import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'

@inject('store')
@observer
class DeleteButton extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    store: PropTypes.object.isRequired
  }
  deleteFile(id) {
    this.props.store.deleteFile(id)
  }
  render() {
    const { id } = this.props

    return (
      <Button
        size="mini"
        onClick={() => {
          this.deleteFile(id)
        }}
      >
        Delete
      </Button>
    )
  }
}

export default DeleteButton
