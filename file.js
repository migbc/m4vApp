

function regNameFile(filename) {
    const arrayFile = [];

}

function test(fileName) {
    return path.basename(fileName).split('.')
}


// ffmpeg -i source.mkv -c copy -c:s srt.srt out.m4v
// ffmpeg -i out.m4v -i jpg.jpg -map 1 -map 0 -c copy -disposition:0 attached_pic out_final.m4v 
// nom.SXX.EXX.libelle.m4v
