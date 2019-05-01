import React, { Component, FormEvent } from "react";
import { Button, Card, Form } from "semantic-ui-react";
import { observer, inject } from "mobx-react";
//@ts-ignore
import Editor from "react-medium-editor";
import Store from "./Store";

interface ArticleForm {
  store: Store;
}
@inject("store")
@observer
class ArticleForm extends Component<ArticleForm> {
  handleArticle = (e: FormEvent) => {
    e.preventDefault();
    this.props.store.createFile();
  };
  updateContent = (content: string) => {
    // TODO
    this.props.store.setFile(content);
  };
  clearFile = () => {
    this.props.store.clearFile();
  };
  render() {
    const { file } = this.props.store;
    return (
      <div>
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
              <Form onSubmit={this.handleArticle} style={{ float: "right" }}>
                <Form.Button content="Save" type={"submit"} />
              </Form>
            </Card.Description>
          </Card.Content>
        </Card>
        <br />
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
      </div>
    );
  }
}

export default ArticleForm;
