import React, { Component } from 'react'
import { Form, Input } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react'

@inject('store') @observer
class ArticleForm extends Component {
  handleArticle = e => {
    e.preventDefault()
    this.props.store.createArticle(this.titleRef.value, this.inputRef.value)
    this.titleRef.value = ''
    this.inputRef.value = ''
  }
  render() {
    return (
      <Form onSubmit={this.handleArticle}>
        <Form.Field>
          <Input defaultValue=''>
            <input placeholder='Title' ref={c => { this.titleRef = c }} />
          </Input>
          <Input defaultValue=''>
            <textarea placeholder='Create an article..' ref={c => { this.inputRef = c }} />
          </Input>
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