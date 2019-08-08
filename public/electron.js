const electron = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')
const { DaemonFactory } = require('@textile/go-daemon')

const { app, BrowserWindow, ipcMain } = electron

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680 })
  mainWindow.loadURL(
    isDev
      ? 'http://127.0.0.1:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', () => {
  const df = new DaemonFactory()
  df.spawn({ disposable: true })
    .then(daemon => {
      console.log('daemon ready now create window')
      createWindow()
      console.log('get profile')
      daemon.api.profile
        .get()
        .then(profile => {
          console.log('got profile address', profile.address)
          console.log('message', JSON.stringify(profile, undefined, 2))
          //daemon.stop()
        })
        .catch(err => {
          console.log('error', err.toString())
        })
    })
    .catch(err => {
      console.log('error', err.toString())
    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
