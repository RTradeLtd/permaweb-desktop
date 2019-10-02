const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')
const { DaemonFactory } = require('@textile/go-daemon')
const { default: Wallet, Keypair } = require('@textile/wallet')
const bip39 = require('bip39')
const Store = require('electron-store')

const {
  PERMAWEB_APP_NAMESPACE,
  PERMAWEB_PINCODE,
  PERMAWEB_IO_PEER_ID,
  PERMAWEB_IO_CAFE_TOKEN
} = process.env
const store = new Store()

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
  const potentialSecret = store.get(PERMAWEB_APP_NAMESPACE)
  const secret = potentialSecret || generateSecret()
  const keypair = Keypair.fromSecret(secret)
  return { keypair, secret }
}

function getRepoPath(address) {
  return path.join(app.getPath('userData'), address)
}

async function spawnDaemon({ secret, repoPath }) {
  const df = new DaemonFactory()
  daemon = await df.spawn({ disposable: false, repoPath })
  // init if needed (first time user)
  if (!daemon.initialized) {
    await daemon.init(secret, { pincode: PERMAWEB_PINCODE })
    store.set(PERMAWEB_APP_NAMESPACE, secret)
  }
  await daemon.start({ serveDocs: true, pincode: PERMAWEB_PINCODE })
  return daemon
}

async function connectToCafe(daemon) {
  try {
    const { items: list } = await daemon.api.cafes.list()
    if (list.find(({ id }) => id === PERMAWEB_IO_PEER_ID)) {
      // already connected
      return
    }
    await daemon.api.cafes.add(PERMAWEB_IO_PEER_ID, PERMAWEB_IO_CAFE_TOKEN)
  } catch (err) {
    console.log('Error connecting to cafe: ', err.toString())
  }
}

app.on('ready', async () => {
  try {
    const { keypair, secret } = await getKeyPair()
    const repoPath = getRepoPath(keypair.publicKey())
    const daemon = await spawnDaemon({ secret, repoPath })
    await connectToCafe(daemon)
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
