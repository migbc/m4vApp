const axios = require('axios');

async function makePostRequest() {
    const data = {
        apikey : "3836fd718cfb1f1eb577a83752d032cf", 
        userkey : "6GZNPDRMOCCPVH6K", 
        username : "migl"
    }
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'JWT fefege...'
      }

      let res = await axios.post('https://api.thetvdb.com/login', data,
      {
  headers:headers
      });
    console.log(`Status code: ${res.status}`);
    console.log(`Status text: ${res.statusText}`);
    console.log(`Request method: ${res.request.method}`);
    console.log(`Path: ${res.request.path}`);

    console.log(`Date: ${res.headers.date}`);
    console.log(`Data: ${res.data.token}`);
    console.log(res.data);
}

makePostRequest();