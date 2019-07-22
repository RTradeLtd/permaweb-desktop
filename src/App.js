import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import Editor from './Editor'
import Files from './Files'
import { Dimmer, Loader } from 'semantic-ui-react'
import { SemanticToastContainer } from 'react-semantic-toasts'
import { createMuiTheme } from '@material-ui/core/styles';
import Screen from './screen'

import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';

import keymap from './keymap'
// @ts-ignore
import { ShortcutManager } from 'react-shortcuts'
import { ThemeProvider } from '@material-ui/styles';
import { CategoryType } from './sidebar';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

@inject('store') @observer
class App extends Component {
  static childContextTypes = {
    shortcuts: PropTypes.object.isRequired
  }
  componentDidMount() {
    this.props.store.getFiles()
  }
  getChildContext() {
    const shortcutManager = new ShortcutManager(keymap)
    return { shortcuts: shortcutManager }
  }
  render() {
    const { store } = this.props
    const view = (screen => {
      switch (screen) {
        case 'online':
          let innerView = {}
          if (store.file) {
            innerView = (
              <div>
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
                title: latestEntry.stored.name
              }
            })

            innerView = (
              <Screen
                avatarImage={undefined}
                categories={[
                  {
                    label: 'Default',
                    type: CategoryType.NOTES
                  },
                  {
                    label: 'Trash',
                    type: CategoryType.TRASH
                  }
                ]}
                folderListing={folderListing}
                onOpenGroup={() => { console.log('on open group') }}
                onCreateGroup={() => { console.log('on create group') }}
                onFileOpen={(fileId, version) => store.selectFile(fileId, version)} />
            )
          }
          return (
            <div style={{ width: '80%', maxWidth: '800px', margin: '1em auto' }}>
              {innerView}
              <Dimmer active={store.isLoading} inverted>
                <Loader size='massive'></Loader>
              </Dimmer>
            </div>
          )
        default:
          return (
            <Dimmer active={store.status === 'offline'}>
              <Loader size='massive'></Loader>
            </Dimmer>
          )
      }
    })(store.status)
    return (
      <div className='App'>
        <ThemeProvider theme={theme}>
          {view}
        </ThemeProvider>
        <SemanticToastContainer />
      </div>
    )
  }
}

export default App
