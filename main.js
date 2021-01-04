const { app, BrowserWindow } = require('electron')
const url = require('url')
const path = require('path')
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const fs = require('fs')
const axios = require('axios')
require('update-electron-app')({
  repo: 'github-user/repo',
  updateInterval: '1 hour',
  logger: require('electron-log')
})

axios.defaults.adapter = require('axios/lib/adapters/http');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    title: "m4vApp",
    frame: true,
    resizable: false,
    transparent: false
    ,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,

    }
  })
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  //mainWindow.loadURL('https://calendar.google.com')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
    // We set an intercept on incoming requests to disable x-frame-options
  // headers.
  mainWindow.webContents.session.webRequest.onHeadersReceived({ urls: [ "*://*/*" ] },
    (d, c)=>{
      if(d.responseHeaders['X-Frame-Options']){
        delete d.responseHeaders['X-Frame-Options'];
      } else if(d.responseHeaders['x-frame-options']) {
        delete d.responseHeaders['x-frame-options'];
      }

      c({cancel: false, responseHeaders: d.responseHeaders});
    }
  );
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipc.on('open-dialog', function (event) {
  dialog.showOpenDialog( {
    properties: ['multiselection']
  }).then(result => {
    event.sender.send('selected-file', result.filePaths)
    console.log(result.canceled)
    console.log(result.filePaths)
  }).catch(err => {
    console.log(err)
  })
})

// ipc.on('open-dialog', function (event) {
//   console.log('tutut')
//   dialog.showOpenDialog({ //filters: [
//     // { name: 'text', extensions: ['txt'] }
//     //],
//     properties: ['multiSelections']
//   }, function (files) {
//     console.log(files)
//     event.sender.send('selected-file', files)
//   })
// })

ipc.on('call-tvdb', function (event, date) {
  //event.sender.send('call-foo-return', 'test call-foo-return')
  event.sender.send('call-tvdb-return')
})

ipc.on('call-tvdb2', function (event, date) {
  //event.sender.send('call-foo-return', 'test call-foo-return')
  event.sender.send('call-tvdb2-return')
})

ipc.on('call-change', function (event, date) {
  //event.sender.send('call-foo-return', 'test call-foo-return')
  event.sender.send('call-change-return')
})

ipc.on('call-create', function (event, data) {
  //event.sender.send('call-create-return')
  //downloadImageMain('https://thetvdb.com/banners/series/263365/seasons/1834326/posters/5ea4c1e8e41b2.jpg');
  downloadImageMain(data.url)
  createM4v(data)
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
//app.on('ready',createWindow)
async function downloadImage(url) {
  //const url ='https://thetvdb.com/banners/series/263365/seasons/1834326/posters/5ea4c1e8e41b2.jpg'
  const chemin = path.resolve(__dirname, 'images', 'code1.jpg')
  // axios image download with response type "stream"
  //axios.defaults.adapter = require('axios/lib/adapters/http');
  const response = await axios({
    method: 'GET',
    url: url,
    headers: {
      Accept: 'application/json, text/plain, */*'
    },
    responseType: 'stream'
  })
  // pipe the result stream into a file on disc
  response.data.pipe(fs.createWriteStream(chemin))
  // return a promise and resolve when download finishes
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve()
    })
    response.data.on('error', () => {
      reject()
    })
  })
}

function createM4v(data) {
  const exec = require('child_process').execSync;

  // nom.SXX.EXX.libelle.m4v
  const out_final = data.serieName + '.S' + data.seasonFile + '.E' + data.episodeFile + '.' + data.episodeName + '.m4v';
  //suppression sous titre si present
  // let executablePath = 'D:\\workspace\\m4vApp\\bin\\ffmpeg.exe -i ' + data.src + ' -sn -c copy D:\\Downloads\\out.mkv'
  // //conversion audio vers XXX
  // let executablePath1 = 'D:\\workspace\\m4vApp\\bin\\ffmpeg.exe -i D:\\Downloads\\out.mkv -c copy -c:a ac3 D:\\Downloads\\out1.mkv'
  // //ajout srt
  // let executablePath2 = 'D:\\workspace\\m4vApp\\bin\\ffmpeg.exe -i D:\\Downloads\\out1.mkv -c copy -c:s ' + data.srt + ' D:\\Downloads\\out.m4v'
  // //ajout poster
  // let executablePath3 = 'D:\\workspace\\m4vApp\\bin\\ffmpeg.exe -i D:\\Downloads\\out.m4v -i D:\\workspace\\m4vApp\\images\\code1.jpg -map 1 -map 0 -c copy -disposition:0 attached_pic "D:\\Downloads\\'
  //   + out_final + '"'
  let executablePath = 'D:\\workspace\\m4vApp\\bin\\ffmpeg.exe -i "' + data.src + '" -sn -c:v copy -c:a aac D:\\Downloads\\out_without_srt.m4v'
  let executablePath1 = 'D:\\workspace\\m4vApp\\bin\\ffmpeg.exe -sub_charenc UTF_8 -i "' + data.srt + '" d:\\Downloads\\srt.ass'
  let executablePath2 = 'D:\\workspace\\m4vApp\\bin\\ffmpeg.exe -i D:\\Downloads\\out_without_srt.m4v -i D:\\Downloads\\srt.ass -map 0:v -c:a copy -map 0:a -c:v copy -map 1 -c:s mov_text -metadata:s:s:0 language=fre d:\\Downloads\\out_with_srt.m4v'
  let executablePath3 = 'D:\\workspace\\m4vApp\\bin\\ffmpeg.exe -i D:\\Downloads\\out_with_srt.m4v -i D:\\workspace\\m4vApp\\images\\code1.jpg -map 1 -map 0 -c copy -disposition:0 attached_pic "D:\\Downloads\\' +
    out_final + '"'

  async () => {
    const resultA = await promiseA
    const resultB = await promiseB
    const resultC = await promiseC
    const resultD = await promiseD
    const resultE = await promiseE
    const resultF = await promiseF
    const resultG = await promiseG
    //fs.unlinkSync('D:\\Downloads\\out.mkv');
  };
  const promiseA = new Promise((resolve) => {
    resolve(exec(executablePath));
  });
  const promiseB = new Promise((resolve) => {
    resolve(exec(executablePath1));
  });
  const promiseC = new Promise((resolve) => {
    resolve(exec(executablePath2));
  });
  const promiseD = new Promise((resolve) => {
    resolve(exec(executablePath3));
  });
  const promiseE = new Promise((resolve) => {
    resolve(fs.unlinkSync('D:\\Downloads\\out_without_srt.m4v'));
  });
  const promiseF = new Promise((resolve) => {
    resolve(fs.unlinkSync('D:\\Downloads\\out_with_srt.m4v'));
  });
  const promiseG = new Promise((resolve) => {
    resolve(fs.unlinkSync('D:\\Downloads\\srt.ass'));
  });
}

async function downloadImageMain(url) {
  const data = await downloadImage(url);
}