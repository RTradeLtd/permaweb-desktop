const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')
const { DaemonFactory } = require('@textile/go-daemon')
const { default: Wallet, Keypair } = require('@textile/wallet')
const bip39 = require('bip39')
const keytar = require('keytar')

const PERMAWEB_SECRET = 'Permaweb secret'
const PERMAWEB_APP_NAMESPACE = 'io.permaweb.desktop'
const PERMAWEB_PINCODE = 1234

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

function generateSecret() {
  const mnemonic = bip39.generateMnemonic()
  const wallet = new Wallet(mnemonic)
  return wallet.accountAt(0).keypair.secret()
}

async function getKeyPair() {
  const potentialSecret = await keytar.getPassword(
    PERMAWEB_APP_NAMESPACE,
    PERMAWEB_SECRET
  )
  const secret = potentialSecret || generateSecret()
  const keypair = Keypair.fromSecret(secret)
  return { keypair, secret }
}

function getRepoPath(address) {
  return path.join(app.getPath('userData'), address)
  // should not need this when app gets installed
  //.replace('Electron', 'Permaweb')
}

async function spawnDaemon({ secret, repoPath }) {
  const df = new DaemonFactory()
  daemon = await df.spawn({ disposable: false, repoPath })
  // init if needed (first time user)
  if (!daemon.initialized) {
    await daemon.init(secret, { pincode: PERMAWEB_PINCODE })
    await keytar.setPassword(PERMAWEB_APP_NAMESPACE, PERMAWEB_SECRET, secret)
  }
  await daemon.start({ serveDocs: true, pincode: PERMAWEB_PINCODE })
}

app.on('ready', async () => {
  try {
    const { keypair, secret } = await getKeyPair()
    const repoPath = getRepoPath(keypair.publicKey())
    await spawnDaemon({ secret, repoPath })
    createWindow()
  } catch (err) {
    console.log('Error', err.toString())
  }
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
