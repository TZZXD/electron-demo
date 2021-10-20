const {app, ipcMain, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      javascript: true,      // javascript Boolean (可选) - 是否启用 JavaScript 支持。 默认值为 true。
      nodeIntegration: true, // nodeIntegration Boolean (可选) - 是否启用Node integration. 默认值为 false.
      webSecurity: false,
      // 当设置为 false, 它将禁用同源策略 (通常用来测试网站), 如果此选项不是由开发者设置的，还会把 allowRunningInsecureContent设置为 true. 默认值为 true
      contextIsolation: false
      // 此项为true的话在App.js中无法通过window.require来引用electron包
      // Boolean (可选) - 是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本. 默认为 true。
    }
  })

  mainWindow.loadFile('./build/index.html')
  mainWindow.webContents.openDevTools()
}

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log('main:', arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong' + arg)
})

ipcMain.handle('handle-message', async () => {
  const result = await Promise.resolve('123');
  return result;
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
