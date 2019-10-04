import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { SemanticToastContainer } from 'react-semantic-toasts'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

import Layout from './Layout'
import Home from './screens/Home'
import Group from './screens/Group'
import Post from './screens/Post'
import Edit from './screens/Edit'
import NotFound from './screens/NotFound'
import StoreStatus from './components/StoreStatus'

import 'react-semantic-toasts/styles/react-semantic-alert.css'
import Store from './Store'

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

function App({ store }: { store: Store }) {
  useEffect(() => {
    store.getFiles()
  }, [])

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <StoreStatus>
          <Layout>
            <Switch>
              <Route path="/404" component={NotFound} />
              <Route exact path="/" component={Home} />
              <Route exact path="/g/:groupId" component={Group} />
              <Route exact path="/g/:groupId/p/:postId" component={Post} />
              <Route exact path="/e/:groupId/:postId" component={Edit} />
              <Redirect from="*" to="/404" />
            </Switch>
          </Layout>
        </StoreStatus>
      </ThemeProvider>
      <SemanticToastContainer />
    </Router>
  )
}

export default inject('store')(observer(({ store }) => <App store={store} />))
