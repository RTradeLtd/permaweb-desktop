import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { List, Button } from "semantic-ui-react";
import Moment from 'react-moment';
import DeleteButton from "./DeleteButton";
import Store, { UIFile } from "./Store";
import { LeftProperty } from "csstype";

interface FileListItemProps {
  store: Store;
  file: UIFile[];
  selectedFileId: string;
  key: string;
  id: string;
  version: number;
  copyLink: (hash: string | undefined, key: string | undefined) => void;
}

@inject("store")
@observer
class FileListItem extends Component<FileListItemProps> {
  showFile = () => {
    this.props.store.selectFile(this.props.id, this.props.version);
  };
  isSelected = () => {
    const { selectedFileId, selectedFileVersion } = this.props.store
    return (selectedFileId === this.props.id &&
      selectedFileVersion === this.props.version);
  }
  copyLinkToClipboard = () => {
    let file = this.props.file[0]
    this.props.copyLink(file.hash, file.key)
  };
  selectFile = () => {
    this.props.store.selectFileId(this.props.id, this.props.version)
  };
  showHistory = () => {
    this.props.store.toggleHistory(true)
  };
  render() {
    const file = this.props.file[0]
    const { showHistory } = this.props.store
    const linkStyle = {
      color: "inherit",
      border: "none",
      padding: "0",
      font: "inherit",
      cursor: "pointer",
      background: "none",
      width: "270px",
      textAlign: "left" as LeftProperty<any>
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
            {
              !showHistory &&
              <List.Content floated='right'>
                <Button
                  size="mini"
                  onClick={() => {
                    this.copyLinkToClipboard();
                  }}
                >
                  Copy Link
                </Button>
                <Button
                  size="mini"
                  onClick={() => { this.showHistory() }}
                >
                  Show History
                </Button>
                <DeleteButton id={this.props.id} />
              </List.Content>
            }
            <List.Content floated='right' width="110px">
              <Moment fromNow>{file.date}</Moment>
            </List.Content>
            <List.Content style={{ overflow: "hidden", maxWidth: "270px" }}>
              <button style={linkStyle} onClick={() => this.showFile()}>
                {file.caption}
              </button>
            </List.Content>
          </ div>
        }
      />
    );
  }
}

export default FileListItem;
