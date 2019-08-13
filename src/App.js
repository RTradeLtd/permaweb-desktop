import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Editor from './Editor'
import { Dimmer, Loader } from 'semantic-ui-react'
import { SemanticToastContainer } from 'react-semantic-toasts'
import { createMuiTheme } from '@material-ui/core/styles'
import Screen from './screen'
import FolderListing from './components/FolderListing'
import FileEntry from './components/FileEntry'

import 'react-semantic-toasts/styles/react-semantic-alert.css'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/default.css'

import keymap from './keymap'
// @ts-ignore
import { ShortcutManager } from 'react-shortcuts'
import { ThemeProvider } from '@material-ui/styles'
import { CategoryType } from './components/Sidebar'
// @ts-ignore
import { toast } from 'react-semantic-toasts'

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

@inject('store')
@observer
class App extends Component {
  static childContextTypes = {
    shortcuts: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)

    this.onFileOpen = this.onFileOpen.bind(this)
    this.onCopyLink = this.onCopyLink.bind(this)
    this.onShowHistory = this.onShowHistory.bind(this)
    this.onDeleteFile = this.onDeleteFile.bind(this)
  }
  componentDidMount() {
    this.props.store.getFiles()
  }
  getChildContext() {
    const shortcutManager = new ShortcutManager(keymap)
    return { shortcuts: shortcutManager }
  }
  onFileOpen(fileId, version) {
    this.props.store.selectFile(fileId, version)
  }
  onCopyLink(hash, key) {
    if (hash) {
      const link = `https://gateway.textile.cafe/ipfs/${hash}?key=${key}`
      navigator.clipboard.writeText(link)

      toast({
        title: 'Success',
        description: 'Copied link to clipboard'
      })
    }
  }
  onDeleteFile(id) {
    this.props.store.deleteFile(id)
  }
  onShowHistory(fileId, version) {
    console.log(fileId, version)
    this.props.store.selectFileId(fileId, version)
    this.props.store.toggleHistory(true)
  }
  render() {
    const { store } = this.props
    const view = (screen => {
      switch (screen) {
        case 'online':
          let innerView = {}
          let mainContent
          if (store.file) {
            mainContent = (
              <div
                style={{ width: '80%', maxWidth: '800px', margin: '1em auto' }}
              >
                <Editor />
              </div>
            )
          } else {
            const files = store.files
            const folderListing = Object.keys(files).map(fileId => {
              const latestEntry = files[fileId][0]
              return {
                id: fileId,
                version: 0,
                hash: latestEntry.hash,
                fileKey: latestEntry.key,
                title: latestEntry.stored.name
              }
            })

            const fileEntries = folderListing.map(f => {
              return (
                <FileEntry
                  key={f.id}
                  {...f}
                  onClick={this.onFileOpen}
                  onCopyLink={this.onCopyLink}
                  onShowHistory={this.onShowHistory}
                  onDelete={this.onDeleteFile}
                />
              )
            })

            mainContent = <FolderListing>{fileEntries}</FolderListing>
          }

          innerView = (
            <Screen
              username={store.profile ? store.profile.username : 'Anon'}
              avatarImage={undefined}
              categories={[
                {
                  label: 'Home',
                  type: CategoryType.NOTES
                },
                {
                  label: 'Trash',
                  type: CategoryType.TRASH
                }
              ]}
              showAddFab={!store.file}
              onOpenGroup={() => store.clearFile()}
              onCreateGroup={() => {
                console.log('on create group')
              }}
              onFileOpen={this.onFileOpen}
              onAddFile={() =>
                store.setFile('<p>Create your article here...</p>')
              }
            >
              {mainContent}
            </Screen>
          )

          return (
            <div>
              {innerView}
              <Dimmer active={store.isLoading} inverted>
                <Loader size="massive" />
              </Dimmer>
            </div>
          )
        default:
          return (
            <Dimmer active={store.status === 'offline'}>
              <Loader size="massive" />
            </Dimmer>
          )
      }
    })(store.status)
    return (
      <div className="App">
        <ThemeProvider theme={theme}>{view}</ThemeProvider>
        <SemanticToastContainer />
      </div>
    )
  }
}

export default App
