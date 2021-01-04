const ipc = require('electron').ipcRenderer
const fs = require('fs')
const path = require('path')
const axios = require('axios')
axios.defaults.adapter = require('axios/lib/adapters/xhr');

function callCreate() {
    //console.log('callCreate')
    const data = {
        serieName: document.getElementById("listeSerie").options[document.getElementById('listeSerie').selectedIndex].text,
        seasonFile: document.getElementById('seasonFile').value,
        episodeFile: document.getElementById('episodeFile').value,
        episodeName: (document.getElementById('nameFile').value).replace(':',''),
        src: document.getElementById('src').value,
        srt: document.getElementById('srt').value
    }
    const out_final = data.serieName + '.S' + data.seasonFile + '.E' + data.episodeFile + '.' + data.episodeName + '.m4v';

    console.log(out_final)
    ipc.send('call-create', data)
}
function splitFile(fileName) {
    return path.basename(fileName).split('.')
}

ipc.on('selected-file', function (event, data) {

    var fileName = splitFile(data[0])
    fileName.forEach(element => regEXPF(element));
    document.getElementById("nameFile").value = fileName[0] + '+' + fileName[1]
    document.getElementById("src").value = data[0]
    document.getElementById("srt").value = data[1]

    const returnloginTVDB = loginTVDB()
    const tvdbAPI = new tvdbAPIClass();

    tvdbAPI.getListSerie()
        .then(function (result) {
            //console.log( new Object(result.data).si); // "Stuff worked!"
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

function regEXPF(element) {
    const regExp = new RegExp('[sS][0-9]+[eE][0-9]+')  //'[Ss]([0-9]+)[][ ._-]*[Ee]([0-9]+)([^\\/]*)$');
    if (regExp.test(element)) {
        const regEXP2 = new RegExp("[a-zA-Z]+");
        const data = element.split(regEXP2)
        document.getElementById('seasonFile').value = data[1]
        document.getElementById('episodeFile').value = data[2]
    }
}
const exec = require('child_process').exec;

function execute(command, callback) {
    exec(command, (error, stdout, stderr) => {
        callback(stdout);
    });
};