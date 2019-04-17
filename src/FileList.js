import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { List, Button } from 'semantic-ui-react'
import { toast } from "react-semantic-toasts"

@inject('store') @observer
class FileList extends Component {
  showFile (thread) {
    let file = this.props.store.getFileFromThread(thread)

    if (file) {
      this.props.store.getFile(thread.caption, file.hash, file.key)
    }
  }
  copyLinkToClipboard (thread) {
    let file = this.props.store.getFileFromThread(thread)
    this.linkRef.value = `www.getepona.com?hash=${file.hash}&key=${file.key}`
    this.linkRef.select();
    document.execCommand('copy');
    
    toast({
      title: 'Success',
      description: 'Copied link to clipboard'
    });
  }
  render () {
    const linkStyle = {
      color: 'inherit',
      border: 'none',
      padding: '0',
      font: 'inherit', 
      cursor: 'pointer',
      background: 'none',
    }
    const { files } = this.props.store
    if (!files) {
      return null;
    }
  
    if (!files.length) {
      return (
        <div>
          <p>There are no files in your folder.</p>
        </div>
      );
    } else {
      return (
        <div>
          <input style={ {position: 'absolute', left: '-9999px'} } ref={c => { this.linkRef = c }} />
          <List>
            {files.map(file => (
              <List.Item icon='file'
                key={file.target}
                content={
                  <div>
                    <button style={linkStyle} onClick={() => this.showFile(file)}>
                      {file.caption}
                    </button>
                    <Button size='mini' style={ {float: 'right'} } onClick={() => { this.copyLinkToClipboard(file) }}>Copy Link</Button>
                  <br></br>
                  </div>
                } />
            ))}
          </List>
        </div>
      );
    }
  }
}

export default FileList
