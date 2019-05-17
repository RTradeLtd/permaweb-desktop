import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { List, Button } from "semantic-ui-react";
import Moment from 'react-moment';
import DeleteButton from "./DeleteButton";
import Store, { UIFile } from "./Store";

interface FileListItemProps {
  store: Store;
  file: UIFile[];
  selectedFileId: string;
  key: string;
  id: string;
  copyLink: (hash: string | undefined, key: string | undefined) => void;
}

@inject("store")
@observer
class FileListItem extends Component<FileListItemProps> {
  showFile = () => {
    this.props.store.selectFile(this.props.id);
  };
  isSelected = () => {
    return (this.props.selectedFileId &&
      this.props.selectedFileId === this.props.id);
  }
  copyLinkToClipboard = () => {
    let file = this.props.file[0]
    this.props.copyLink(file.hash, file.key)
  };
  selectFile = () => {
    this.props.store.selectFileId(this.props.id)
  };
  render() {
    const file = this.props.file[0]
    const linkStyle = {
      color: "inherit",
      border: "none",
      padding: "0",
      font: "inherit",
      cursor: "pointer",
      background: "none"
    };
    let backgroundStyle = {
      padding: "5px",
      background: "none"
    }
    if (this.isSelected()) {
      backgroundStyle.background = "#d9edf7"
    }
    return (
      <List.Item
        icon="file"
        style={backgroundStyle}
        onClick={this.selectFile}
        content={
          <div>
            <List.Content floated='right'>
              <Button
                size="mini"
                onClick={() => {
                  this.copyLinkToClipboard();
                }}
              >
                Copy Link
              </Button>
              <DeleteButton id={file.key} />
            </List.Content>
            <List.Content floated='right'>
              <Moment fromNow>{file.date}</Moment>
            </List.Content>
            <List.Content>
              <button style={linkStyle} onClick={() => this.showFile()}>
                {file.caption}
              </button>
            </List.Content>
          </div>
        }
      />
    );
  }
}

export default FileListItem;
