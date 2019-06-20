import React, { Component, FormEvent } from "react";
import { Button, Card, Form } from "semantic-ui-react";
import { inject } from "mobx-react";
import Moment from 'react-moment';
//@ts-ignore
import Editor from "react-medium-editor";
//@ts-ignore
import MediumEditor from 'medium-editor'
import Store from "./Store";
// @ts-ignore
import { Shortcuts } from 'react-shortcuts'
import 'emoji-mart/css/emoji-mart.css'
// @ts-ignore
import { Emoji, Picker, emojiIndex } from 'emoji-mart'
import { renderToString } from 'react-dom/server'
// @ts-ignore
import CodeMirror from 'react-codemirror'
require('codemirror/lib/codemirror.css');
// @ts-ignore
import Showdown from 'showdown'
// @ts-ignore
import TurndownService from 'turndown'
//@ts-ignore
import { toast } from "react-semantic-toasts";

interface ArticleForm {
  store: Store;
}

@inject("store")
class ArticleForm extends Component<ArticleForm> {
  emojiRef?: HTMLElement;
  editor: any;
  markdownConverter: any;
  htmlConverter: any;
  state = {
    savedFileContent: "",
    fileContent: "",
    fileMarkdown: "",
    showEmoji: false,
    showMarkdown: false
  };
  shouldComponentUpdate(_nextProps: any, nextState: any) {
    return (this.state.showEmoji !== nextState.showEmoji) || (this.state.showMarkdown !== nextState.showMarkdown)
  };
  componentDidMount() {
    this.markdownConverter = new Showdown.Converter();
    this.htmlConverter = new TurndownService({ headingStyle: 'atx' });

    const el = document.getElementById("epona-editor");
    this.editor = MediumEditor.getEditorFromElement(el);

    const { file } = this.props.store;
    const fileContent = (file && file.stored.body) || ""
    this.setState({ savedFileContent: fileContent })
    this.updateFileContent(fileContent)
    this.updateMarkdownFromContent(fileContent)
  }
  handleArticle = (e: FormEvent) => {
    e.preventDefault();
    let html = this.editor.getContent() || this.markdownConverter.makeHtml(this.state.fileMarkdown);
    if (html === this.state.savedFileContent) {
      toast({
        title: "Success",
        description: "This is already saved."
      });
      return;
    }
    this.props.store.setFile(html);
    this.props.store.createFile();
  };
  updateFileContent = (content: string) => {
    this.setState({ fileContent: content, showEmoji: false })
    this.editor.setContent(content); // force editor to update
  }
  updateMarkdownFromContent = (content: string) => {
    let markdown = this.htmlConverter.turndown(content)
    this.setState({ fileMarkdown: markdown })
  }
  checkFileContent = (content: string) => {
    let matchColon = new RegExp(/[ >]:<\/[a-zA-Z0-9]+>$/)
    let matchEmoji = new RegExp(/[ >:]:[a-zA-Z0-9\+_\-]+:/)
    let emojiMatches = content.match(matchEmoji) || []

    for (let index = 0; index < emojiMatches.length; index++) {
      const emojiMatch = emojiMatches[index];
      let searchText = emojiMatch.substring(2, emojiMatch.length - 1)
      let colonText = `:${searchText}:`
      let results = emojiIndex.search(searchText).filter((emoji: any) => {
        return emoji.colons && emoji.colons === colonText
      })

      if (results && results.length > 0) {
        let emoji = results[0]
        let emojiHtml = renderToString(<span contentEditable={true} dangerouslySetInnerHTML={{ __html: Emoji({ html: true, emoji: emoji.colons, size: 24 }) }}></span>)

        let replaceText = new RegExp(colonText, "g")
        content = content.replace(replaceText, `${emojiHtml}.`)
        this.updateFileContent(content)
      }
    }

    if (matchColon.test(content)) {
      this.setState({ showEmoji: true })
    }

    this.setState({ fileContent: content })
    this.updateMarkdownFromContent(content)
  };
  toggleMarkdown = () => {
    this.setState({ showMarkdown: !this.state.showMarkdown })
  };
  addEmoji = (emoji: any) => {
    this.editor.pasteHTML(emoji.colons);
    this.updateFileContent(this.editor.getContent())
  };
  emojiButton = () => {
    const handleButtonClick = () => {
      this.setState({ showEmoji: !this.state.showEmoji })
    }
    const EmojiButton = MediumEditor.Extension.extend({
      name: 'emoji',
      init: function () {
        this.button = this.document.createElement('button');
        this.button.classList.add('medium-editor-action');
        this.button.innerHTML = ':)';
        this.button.title = 'Emoji';
        this.on(this.button, 'click', handleButtonClick);
      },
      getButton: function () {
        return this.button;
      }
    });
    return new EmojiButton()
  }
  updateMarkdownEvent = (markdown: any) => {
    let html = this.markdownConverter.makeHtml(markdown);
    this.updateFileContent(html);
    this.setState({ fileMarkdown: markdown });
  }
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
              <Button
                onClick={() => {
                  this.toggleMarkdown();
                }}
                primary
              >
                Toggle
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
        {
          this.state.showMarkdown ?
            <CodeMirror
              value={this.state.fileMarkdown}
              onChange={this.updateMarkdownEvent}
              options={{ lineNumbers: true }}
            />
            : <Editor
              id="epona-editor"
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
              onChange={this.checkFileContent}
              text={this.state.fileContent}
              options={{
                toolbar: {
                  buttons: ['bold', 'italic', 'underline', 'emoji']
                },
                buttonLabels: 'fontawesome',
                extensions: {
                  'emoji': this.emojiButton()
                }
              }}
            />
        }
        <div>
          {
            this.state.showEmoji ? <Picker title='Pick your emoji…' emoji='point_up' set='emojione' onSelect={this.addEmoji} style={{ position: 'absolute', bottom: '20px', right: '20px' }} /> : null
          }
        </div>
      </Shortcuts>
    );
  }
}

export default ArticleForm;
