import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import Profile from './Profile'
import { Dimmer, Loader } from 'semantic-ui-react'
import { SemanticToastContainer } from 'react-semantic-toasts'
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';

@inject('store') @observer
class App extends Component {
  componentDidMount() {
    this.props.store.getFiles()
  }
  render () {
    const { store } = this.props
    const view = (screen => {
      switch (screen) {
        case 'online':
          return (
            <div style={{ width: '80%', maxWidth: '800px', margin: '1em auto' }}>
              <Profile />
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
        {view}
        <SemanticToastContainer />
      </div>
    )
  }
}

export default App
