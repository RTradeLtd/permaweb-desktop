import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { List, Button } from 'semantic-ui-react'
import { toast } from "react-semantic-toasts"
import DeleteButton from './DeleteButton'

@inject('store') @observer
class FileList extends Component {
  showFile (filename) {
    let file = this.props.store.getFileFromName(filename)
    
    if (file) {
      this.props.store.getFileContent(file.hash, file.key)
    }
  }
  copyLinkToClipboard (filename) {
    let file = this.props.store.getFileFromName(filename)

    if (file) {
      this.linkRef.value = `https://getepona.herokuapp.com?hash=${file.hash}&key=${file.key}`
      this.linkRef.select();
      document.execCommand('copy');
      
      toast({
        title: 'Success',
        description: 'Copied link to clipboard'
      });
    }
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
  
    if (Object.keys(files).length <= 0) {
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
            {Object.keys(files).map(filename => (
              <List.Item icon='file'
                key={filename}
                content={
                  <div>
                    <button style={linkStyle} onClick={() => this.showFile(filename)}>
                      {filename}
                    </button>
                    <div style={ {float: 'right'} }>
                      <Button size='mini' onClick={() => { this.copyLinkToClipboard(filename) }}>Copy Link</Button>
                      <DeleteButton filename={ filename } />
                    </div>
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
