const Fs = require('fs')  
const Path = require('path')  
const axios = require('axios')
axios.defaults.adapter = require('axios/lib/adapters/http');

async function downloadImage (url) {

  //const url ='https://thetvdb.com/banners/series/263365/seasons/1834326/posters/5ea4c1e8e41b2.jpg'
  console.log(url)
  console.log(__dirname)
  const path = Path.resolve(__dirname, 'images', 'code1.jpg')

  // axios image download with response type "stream"
  //axios.defaults.adapter = require('axios/lib/adapters/http');
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  })

  console.log(response)
  // pipe the result stream into a file on disc
  response.data.pipe(Fs.createWriteStream(path))

  console.log(path)
  // return a promise and resolve when download finishes
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
    console.log('end')
      resolve()
    })

    response.data.on('error', () => {
        console.log('error')
      reject()
    })
  })

}

async function downloadImageMain(url){
    const data = await downloadImage(url);
    console.log("DATA ", data);
}

downloadImageMain ('https://thetvdb.com/banners/series/263365/seasons/1834326/posters/5ea4c1e8e41b2.jpg');