import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import ArticleForm from './ArticleForm'
import FileList from './FileList'
import PropTypes from 'prop-types'

@inject('store')
@observer
class Profile extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }
  render() {
    const { file } = this.props.store

    if (file) {
      return (
        <div>
          <ArticleForm />
        </div>
      )
    }
    return <FileList />
  }
}

export default Profile
