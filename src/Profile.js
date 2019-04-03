import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Card, Icon, Button } from 'semantic-ui-react'
import Moment from 'react-moment'
import FileList from './FileList'
import ArticleForm from './ArticleForm'

@inject('store') @observer
class Profile extends Component {
  clearFile() {
    this.props.store.clearFile()
  }
  render () {
    const { profile, files, file, fileTitle } = this.props.store
    let fileCount = files && files.length ? files.length : 0

    if (file) {
      return (
        <div>
          <Card style={{ width: '100%' }}>
            
            <Card.Content>
              <Card.Header><h3>{fileTitle}</h3></Card.Header>     
              <Card.Description>{file}</Card.Description>
            </Card.Content>
            <Card.Content extra>
            <Button onClick={() => { this.clearFile() }} primary>Back</Button>
            </Card.Content>
          </Card>
        </div>
      )
    }
    return (
      <div>
        <Card style={{ width: '100%' }}>
          <Card.Content>     
            <ArticleForm />
            <br></br>
            <hr></hr>
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
