import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { List } from 'semantic-ui-react'

@inject('store') @observer
class FileList extends Component {
  showFile(file) {
    if (file.files &&
      file.files[0] &&
      file.files[0].file &&
      file.files[0].file.hash &&
      file.files[0].file.key) {
        this.props.store.getFile(file.caption, file.files[0].file.hash, file.files[0].file.key)
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
  
    if (!files.length) {
      return (
        <div>
          <p>There are no files in your folder.</p>
        </div>
      );
    } else {
      return (
        <div>
          <List>
            {files.map(file => (
              <List.Item icon='file'
                key={file.target}
                content={
                  <button style={linkStyle} onClick={() => this.showFile(file)}>
                    {file.caption}
                  </button>
                } />
            ))}
          </List>
        </div>
      );
    }
  }
}

export default FileList
