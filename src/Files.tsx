import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Card, Icon, Button, List } from "semantic-ui-react";
import Store from "./Store";
import Moment from 'react-moment'
import FileListItem from "./FileListItem";
// @ts-ignore
import { Shortcuts } from 'react-shortcuts'
// @ts-ignore
import { toast } from "react-semantic-toasts";

interface FileListProps {
  store: Store;
}

@inject("store")
@observer
class Files extends Component<FileListProps> {
  linkRef?: HTMLInputElement;
  setSelectedFileByPosition(index: number) {
    const { fileIds, showHistory, selectedFileId } = this.props.store
    if (showHistory) {
      this.props.store.selectFileId(selectedFileId, index)
    } else if (fileIds.length > 0 &&
      index >= 0 &&
      index < fileIds.length) {
      this.props.store.selectFileId(fileIds[index], 0)
    }
  }
  _handleShortcuts = (action: any) => {
    const { files } = this.props.store;
    let { selectedFileId, showHistory } = this.props.store
    switch (action) {
      case 'UP':
        let up = this.props.store.getCurrentFilePosition()
        console.log(`current: ${up}, up: ${up--}`)
        this.setSelectedFileByPosition(up--)
        break
      case 'DOWN':
        let down = this.props.store.getCurrentFilePosition()
        console.log(`current: ${down}, down: ${down++}`)
        this.setSelectedFileByPosition(down++)
        break
      case 'FIRST_ITEM':
        this.setSelectedFileByPosition(0)
        break
      case 'LAST_ITEM':
        let length = 0
        if (showHistory) {
          length = files[selectedFileId].length
        } else {
          length = Object.keys(files).length
        }
        this.setSelectedFileByPosition(length - 1)
        break
      case 'COPY_LINK':
        let hash = files[selectedFileId][0].hash
        let key = files[selectedFileId][0].key
        this.copyLink(hash, key)
        break
      case 'OPEN':
        this.props.store.selectFile(selectedFileId, 0);
        break
      case 'DELETE':
        this.props.store.deleteLatestFile(selectedFileId);
        break
      case 'BACK':
        this.props.store.toggleHistory(false);
        break
      case 'CREATE_PAGE':
        this.createEmptyFile();
        break
      default:
        console.log('No shortcut action available')
    }
  };
  copyLink(key: string | undefined, hash: string | undefined) {
    if (hash && this.linkRef) {
      const link = `https://gateway.textile.cafe/ipfs/${hash}?key=${key}`
      this.linkRef.value = link;
      this.linkRef.select();
      document.execCommand("copy");

      toast({
        title: "Success",
        description: "Copied link to clipboard"
      });
    }
  }
  createEmptyFile() {
    this.props.store.setFile("<h1>Title</h1><p>Create your article here...</p>")
  }
  render() {
    const { profile, files, selectedFileId, showHistory } = this.props.store
    let fileCount = files ? Object.keys(files).length : 0
    if (!files) {
      return null;
    }
    let view = null

    if (fileCount <= 0) {
      view = (
        <div>
          <p>There are no files in your folder.</p>
        </div>
      );
    } else if (showHistory) {
      let selectedFile = files[selectedFileId]
      view = (
        <div>
          <p title='folder'>
            <Button size='mini' onClick={() => { this.props.store.toggleHistory(false) }}>Back</Button>
            <Icon name='file' />Showing History: {selectedFile.length} versions
          </p>
          <hr></hr>
          <input
            style={{ position: "absolute", left: "-9999px" }}
            ref={(c: HTMLInputElement) => {
              this.linkRef = c || undefined;
            }}
          />
          <List>
            {Object.keys(selectedFile).map((_, index) => (
              <FileListItem
                key={`${index}`}
                id={selectedFileId}
                store={this.props.store}
                selectedFileId={selectedFileId}
                file={selectedFile}
                version={index}
                copyLink={(hash: string | undefined, key: string | undefined) => {
                  this.copyLink(hash, key);
                }}
              >
              </FileListItem>
            ))}
          </List>
        </div>
      );
    } else {
      view = (
        <div>
          <p title='folder'>
            <Icon name='folder' />{fileCount} files
          </p>
          <hr></hr>
          <input
            style={{ position: "absolute", left: "-9999px" }}
            ref={(c: HTMLInputElement) => {
              this.linkRef = c || undefined;
            }}
          />
          <List>
            {Object.keys(files).map(id => (
              <FileListItem
                key={id}
                id={id}
                store={this.props.store}
                selectedFileId={selectedFileId}
                file={files[id]}
                version={0}
                copyLink={(hash: string | undefined, key: string | undefined) => {
                  this.copyLink(hash, key);
                }}
              >
              </FileListItem>
            ))}
          </List>
        </div>
      );
    }

    return (
      <Shortcuts
        name='FILE_LIST'
        handler={this._handleShortcuts}
      >
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
              {view}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            Updated <Moment fromNow>{profile.updated}</Moment>
          </Card.Content>
        </Card>
      </Shortcuts>
    )
  }
}

export default Files;
