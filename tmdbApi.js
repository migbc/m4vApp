const URL_tmdb = 'https://api.thetmdb.com/'

function calltmdb() {
    ipc.send('call-tmdb')
    // , (event, arg) => {
    //     foo('test')
    //   })
}

function change() {
    ipc.send('call-change')
}

function selectFile() {
    ipc.send('open-dialog')
}

class tmdbAPIClass {
    constructor() {

        // store and manage auth token
        let token = null;

        this.getToken = function () {
            if (token === null) {
                // console.log('jepasse')
                token = logintmdb() // logIn(this.apiKey);
            }
            // else {
            //     console.log('je passe pas ')
            // }

            return token;
        };
        this.token = token;
    }
    getListMovie() {
        //let bearer = 'azazaz'
        //     this.getToken()
        //         .then(token => {
        //             bearer = token
        //             console.log('getListSerie' + bearer)
        console.log('getListMovie')
        //return this.getToken()
        // this.then(function (result) {
        // let bearer = result.data.token;
        const headers = {
            // 'Authorization': 'Bearer ' + bearer
        }
        const params = {
            api_key: "598723c6e19babb8c2b6e71f84e215af",
            language: "fr-FR",
            query: document.getElementById("nameFile").value
        }
        const url = 'https://api.themoviedb.org/3/search/movie'
        return axios.get(url,
            {
                params: params,
                headers: headers
            }).then(response => {
                let res = response
                console.log(res)
                return res //.data.token
            }).then(error => {
                return error
            })
        // }, function (err) {
        //     console.log(err); // Error: "It broke"
        // }
        //);
    }

}

ipc.on('call-tmdb-return', function (event, data) {
    //const returnlogintmdb = logintmdb()
    const tmdbAPI = new tmdbAPIClass();

    tmdbAPI.getListMovie()
        .then(function (result) {

            let listMovie = result.data.results
            console.log(listMovie)
            let container = document.getElementById("listeMovie");

            for (let i in listMovie) {

                var option = document.createElement("option");
                option.text = listMovie[i].original_title;
                option.id = listMovie[i].id
                option.value = listMovie[i].poster_path
                container.add(option);

            }

        }
            , function (err) {
                console.log(err); // Error: "It broke"
            }
        );
})

ipc.on('call-change-return', function (event, data) {
    document.getElementById("poster").src = "http://image.tmdb.org/t/p/w185/" + document.getElementById("listeMovie").options[document.getElementById("listeMovie").selectedIndex].value;
    console.log(document.getElementById("poster").src)
})

async function logintmdb() {
    const params = {
        api_key: "598723c6e19babb8c2b6e71f84e215af"
    }
    const headers = {
        'Content-Type': 'application/json'
    }

    return await axios.get('https://api.themoviedb.org/3/authentication/token/new',
        {
            params: params,
            headers: headers
        }
    ).then(response => {
        let res = response

        return res //.data.token
        //document.getElementById("text").innerText = res.data.token
    })
    //return JSON.stringify(res.data.token);
    //return res.data.token

}

// const ipc = require('electron').ipcRenderer



// ipc.on('call-foo', function (event, data) {

//     document.getElementById("text").innerText = data
// })
//makePostRequest();