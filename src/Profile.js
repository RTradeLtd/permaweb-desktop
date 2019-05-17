import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import ArticleForm from './ArticleForm'
import FileList from './FileList'

@inject('store') @observer
class Profile extends Component {
  render() {
    const { file } = this.props.store

    if (file) {
      return (
        <div>
          <ArticleForm />
        </div>
      )
    }
    return (
      <FileList />
    )
  }
}

export default Profile
