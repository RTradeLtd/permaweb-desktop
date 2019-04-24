import React, { Component } from 'react'
import { Button, Card, Form } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import Editor from 'react-medium-editor'

@inject('store') @observer
class ArticleForm extends Component {
  handleArticle = e => {
    e.preventDefault()
    this.props.store.createFile()
  }
  updateContent = content => {
    this.props.store.setFile(content)
  }
  clearFile = () => {
    this.props.store.clearFile()
  }
  render() {
    const { file } = this.props.store
    return (
      <div>
        <Card style={{ width: '100%' }}>
          <Card.Content>
            <Card.Description>
              <Button onClick={() => { this.clearFile() }} primary>Back</Button>
              <Form onSubmit={this.handleArticle} style={ {float: 'right'}}>
                <Form.Button
                  content="Save"
                  type={'submit'}
                />
              </Form>
            </Card.Description>
          </Card.Content>
        </Card>
        <br></br>
        <Editor
          style={{
            minHeight: '10vh',
            fontSize: '16px',
            border: 'none',
            overflow: 'auto',
            outline: 'none',
            WebkitBoxShadow: 'none',
            MozBoxShadow: 'none',
            BoxShadow: 'none',
            resize: 'none'
          }}
          onChange={ this.updateContent }
          text={ file }
        />
      </div>
    );
  }
}

export default ArticleForm