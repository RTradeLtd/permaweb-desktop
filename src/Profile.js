import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Card, Icon, Button } from 'semantic-ui-react'
import Moment from 'react-moment'
import ArticleForm from './ArticleForm'
import FileList from './FileList'

@inject('store') @observer
class Profile extends Component {
  createEmptyFile() {
    this.props.store.setFile("<h1>Title</h1><p>Create your article here...</p>")
  }
  render () {
    const { profile, files, file } = this.props.store
    let fileCount = files ? Object.keys(files).length : 0

    if (file) {
      return (
        <div>
          <ArticleForm />
        </div>
      )
    }
    return (
      <div>
        <Card style={{ width: '100%' }}>
          <Card.Content>
            <Card.Header><h2>Epona Editor</h2></Card.Header>     
          </Card.Content>
          <Card.Content>     
            <Card.Description>
              <Button onClick={() => { this.createEmptyFile() }}>Create New</Button>
            </Card.Description>
          </Card.Content>
          <Card.Content>     
            <Card.Description>
              <p title='folder'>
                <Icon name='folder' />{fileCount} files
              </p>
              <hr></hr>
              <FileList />
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            Updated <Moment fromNow>{profile.updated}</Moment>
          </Card.Content>
        </Card>
      </div>
    )
  }
}

export default Profile
