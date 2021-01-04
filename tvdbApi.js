const URL_TVDB = 'https://api.thetvdb.com/'

function callTVDB() {
    ipc.send('call-tvdb')
    // , (event, arg) => {
    //     foo('test')
    //   })
}

function callTVDB2() {
    ipc.send('call-tvdb2')
    // , (event, arg) => {
    //     foo('test')
    //   })
}

function change() {
    ipc.send('call-change')
}

class tvdbAPIClass {
    constructor() {

        // store and manage auth token
        let token = null;

        this.getToken = function () {
            if (token === null) {
                // console.log('jepasse')
                token = loginTVDB() // logIn(this.apiKey);
            }
            // else {
            //     console.log('je passe pas ')
            // }

            return token;
        };
        this.token = token;
    }
    getListSerie() {
        //let bearer = 'azazaz'
        //     this.getToken()
        //         .then(token => {
        //             bearer = token
        //             console.log('getListSerie' + bearer)
        return this.getToken()
            .then(function (result) {
                let bearer = result.data.token;
                const headers = {
                    'Authorization': 'Bearer ' + bearer
                }
                const url = 'https://api.thetvdb.com/search/series?name=' + document.getElementById("nameFile").value
                return axios.get(url,
                    {
                        headers: headers
                    }).then(response => {
                        let res = response
                        return res //.data.token
                    }).then(error => {
                        return error
                    })
            }, function (err) {
                console.log(err); // Error: "It broke"
            }
            );
    }
    getEpisodesbySeason() {
        return this.getToken()
            .then(function (result) {
                let bearer = result.data.token;
                const headers = {
                    'Authorization': 'Bearer ' + bearer,
                    'Accept-language': 'en'
                }
                //const url = 'https://api.thetvdb.com/search/series?name=' + document.getElementById("seasonFile").value
                const url = 'https://api.thetvdb.com/series/'
                    + document.getElementById("listeSerie").options[document.getElementById('listeSerie').selectedIndex].id
                    + '/episodes/query?airedSeason='
                    + parseInt(document.getElementById("seasonFile").value)
                //console.log(url)
                return axios.get(url,
                    {
                        headers: headers
                    }).then(response => {
                        let res = response
                        return res //.data.token
                    }).then(error => {
                        return error
                    })
            }, function (err) {
                console.log(err); // Error: "It broke"
            }
            );
    }
    getPosterSeason() {
        const headers = {
            'Accept-language': 'en'
        }
        //console.log(headers)
        //console.log(headers.toString)
        //const url = 'https://api.thetvdb.com/search/series?name=' + document.getElementById("nameFile").value
        const url = 'https://api.thetvdb.com/series/'
            + document.getElementById("listeSerie").options[document.getElementById('listeSerie').selectedIndex].id
            + '/images/query?keyType=season&subKey='
            + parseInt(document.getElementById("seasonFile").value)
        //console.log(url)
        return axios.get(url,
            {
                headers: headers
            }
        ).then(response => {

            let res = response
            return res //.data.token
        }).then(error => {

            return error
        })
    }
}

ipc.on('call-tvdb-return', function (event, data) {
    const returnloginTVDB = loginTVDB()
    const tvdbAPI = new tvdbAPIClass();

    tvdbAPI.getListSerie()
        .then(function (result) {
            let listSerie = result.data.data

            let container = document.getElementById("listeSerie");

            for (let i in listSerie) {

                var option = document.createElement("option");
                option.text = listSerie[i].seriesName;
                option.id = listSerie[i].id
                option.value = listSerie[i].poster
                container.add(option);

            }
        }
            , function (err) {
                console.log(err); // Error: "It broke"
            }
        );
})

ipc.on('call-tvdb2-return', function (event, data) {

    const returnloginTVDB = loginTVDB()
    const tvdbAPI = new tvdbAPIClass();

    tvdbAPI.getEpisodesbySeason()
        .then(function (result) {
            let listEpisode = result.data.data

            let episodeNumber = document.getElementById("episodeFile").value
            for (let i in listEpisode) {
                if (listEpisode[i].airedEpisodeNumber == episodeNumber) {
                    document.getElementById("nameFile").value = listEpisode[i].episodeName
                }
            }
        }
            , function (err) {
                console.log(err); // Error: "It broke"
            }
        );
})

ipc.on('call-change-return', function (event, data) {

    const returnloginTVDB = loginTVDB()
    const tvdbAPI = new tvdbAPIClass();
    tvdbAPI.getPosterSeason()
        .then(function (result) {
            let listPoster = result.data.data
            document.getElementById("poster").src = "https://thetvdb.com/banners/" + listPoster[0].fileName
        }
            , function (err) {
                console.log(err); // Error: "It broke"
            }
        );
    tvdbAPI.getEpisodesbySeason()
        .then(function (result) {
            let listEpisode = result.data.data

            let episodeNumber = document.getElementById("episodeFile").value
            for (let i in listEpisode) {
                if (listEpisode[i].airedEpisodeNumber == episodeNumber) {
                    document.getElementById("nameFile").value = listEpisode[i].episodeName
                }
            }
        }
            , function (err) {
                console.log(err); // Error: "It broke"
            }
        );
})




async function loginTVDB() {
    const data = {
        apikey: "3836fd718cfb1f1eb577a83752d032cf",
        userkey: "6GZNPDRMOCCPVH6K",
        username: "migl"
    }
    const headers = {
        'Content-Type': 'application/json'
    }

    return await axios.post('https://api.thetvdb.com/login', data,
        {
            headers: headers
        }).then(response => {
            let res = response

            // console.log(`Status code: ${res.status}`);
            // console.log(`Status text: ${res.statusText}`);
            // console.log(`Request method: ${res.request.method}`);
            // console.log(`Path: ${res.request.path}`);

            // console.log(`Date: ${res.headers.date}`);
            // console.log(`Data: ${res.data.token}`);
            // console.log(res.data.token);
            return res //.data.token
            //document.getElementById("text").innerText = res.data.token
        })
    //return JSON.stringify(res.data.token);
    //return res.data.token

}


ipc.on('call-tvdb2-return', function (event, data) {

    const returnloginTVDB = loginTVDB()
    const tvdbAPI = new tvdbAPIClass();

    tvdbAPI.getEpisodesbySeason()
        .then(function (result) {
            let listEpisode = result.data.data

            let episodeNumber = document.getElementById("episodeFile").value
            for (let i in listEpisode) {
                if (listEpisode[i].airedEpisodeNumber == episodeNumber) {
                    document.getElementById("nameFile").value = listEpisode[i].episodeName
                }
            }
        }
            , function (err) {
                console.log(err); // Error: "It broke"
            }
        );
})
// const ipc = require('electron').ipcRenderer



// ipc.on('call-foo', function (event, data) {

//     document.getElementById("text").innerText = data
// })
//makePostRequest();