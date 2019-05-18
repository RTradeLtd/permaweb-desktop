import React, { Component, FormEvent } from "react";
import { Button, Card, Form } from "semantic-ui-react";
import { inject } from "mobx-react";
import Moment from 'react-moment';
//@ts-ignore
import Editor from "react-medium-editor";
import Store from "./Store";
// @ts-ignore
import { Shortcuts } from 'react-shortcuts'

interface ArticleForm {
  store: Store;
}
@inject("store")
class ArticleForm extends Component<ArticleForm> {
  state = {
    fileContent: ""
  };
  shouldComponentUpdate() {
    return false
  };
  handleArticle = (e: FormEvent) => {
    e.preventDefault();
    this.props.store.setFile(this.state.fileContent);
    this.props.store.createFile();
  };
  updateContent = (content: string) => {
    this.setState({ fileContent: content })
  };
  clearFile = () => {
    this.props.store.clearFile();
  };
  _handleShortcuts = (action: any) => {
    switch (action) {
      case 'CANCEL':
        this.clearFile();
        break
      default:
        console.log('No shortcut action available')
    }
  };
  render() {
    const { file } = this.props.store;
    return (
      <Shortcuts
        name='EDITOR'
        handler={this._handleShortcuts}
      >
        <Card style={{ width: "100%" }}>
          <Card.Content>
            <Card.Description>
              <Button
                onClick={() => {
                  this.clearFile();
                }}
                primary
              >
                Back
              </Button>
              <div style={{ float: "right" }}>
                <Form onSubmit={this.handleArticle}>
                  <Form.Button content="Save" type={"submit"} />
                </Form>
              </div>
            </Card.Description>
          </Card.Content>
        </Card>
        <br />
        <p>
          <Moment fromNow>{file && file.date}</Moment>
        </p>
        <Editor
          style={{
            minHeight: "10vh",
            fontSize: "16px",
            border: "none",
            overflow: "auto",
            outline: "none",
            WebkitBoxShadow: "none",
            MozBoxShadow: "none",
            BoxShadow: "none",
            resize: "none"
          }}
          onChange={this.updateContent}
          text={(file && file.stored.body) || ""}
        />
      </Shortcuts>
    );
  }
}

export default ArticleForm;
