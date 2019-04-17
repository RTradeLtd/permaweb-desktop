import React, { Component } from 'react'
import { Form, Input } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react'
var MarkdownEditor = require('react-markdown-editor').MarkdownEditor;

@inject('store') @observer
class ArticleForm extends Component {
  handleArticle = e => {
    e.preventDefault()
    this.props.store.createArticle(this.titleRef.value)
  }
  updateContent = content => {
    this.props.store.setArticleText(content)
  }
  render() {
    return (
      <Form onSubmit={this.handleArticle}>
        <Form.Field>
        <Input defaultValue=''>
          <input placeholder='Your Title' ref={c => { this.titleRef = c }} />
        </Input>
        <MarkdownEditor
          onContentChange={ this.updateContent }
          initialContent="Create your article here..."
          iconsSet="font-awesome"/>
        </Form.Field>
        <Form.Button
          content="Create"
          type={'submit'}
        />
      </Form>
    );
  }
}

export default ArticleForm