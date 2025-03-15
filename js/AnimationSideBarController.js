document.addEventListener("DOMContentLoaded", function () {
    let InfoButton = document.getElementById("InfoButton")
    let sideInfo = document.getElementById('SideInfo');
    let musicaudio = document.getElementById("PlayingMusic")
    let videoclip = document.getElementById("VideoClip")

    //Desc
    let ArtistAboutMeName = document.getElementById("ArtistAboutMeName")
    let desc = document.getElementById("Desc")
    let artistpng = document.getElementById("ArtistImage")

    //Next Song
    let NextSongImage = document.getElementById("NextMusicImage")
    let NextSongName = document.getElementById("NextMusicName")
    let NextSongArtist = document.getElementById("NextArtistName")

    var Sidebar = false;

    let SideBarMusicName = document.getElementById('MusicName');
    let SideBarArtistName = document.getElementById('Artist');

    musicaudio.addEventListener("loadedmetadata", function () {
        let musicindex = window.musicindex
        let Playlist = window.Playlist
        let PlaylistKeys = window.PlaylistKeys

        videoclip.src = Playlist[PlaylistKeys[musicindex]].video
        SideBarMusicName.innerHTML = Playlist[PlaylistKeys[musicindex]].nome
        SideBarArtistName.innerHTML = Playlist[PlaylistKeys[musicindex]].autor

        //About Me
        ArtistAboutMeName.innerHTML = Playlist[PlaylistKeys[musicindex]].autor
        desc.innerHTML = Playlist[PlaylistKeys[musicindex]].desc
        artistpng.src = Playlist[PlaylistKeys[musicindex]].aboutmeimage

        //Next Song
        if (musicindex < Object.keys(Playlist).length - 1) {
            NextSongArtist.innerHTML = Playlist[PlaylistKeys[musicindex + 1]].autor
            NextSongImage.src = Playlist[PlaylistKeys[musicindex + 1]].imagem
            NextSongName.innerHTML = Playlist[PlaylistKeys[musicindex + 1]].nome
        } else {
            console.log(Playlist[PlaylistKeys[0]].autor)
            NextSongArtist.innerHTML = Playlist[PlaylistKeys[0]].autor
            NextSongImage.src = Playlist[PlaylistKeys[0]].imagem
            NextSongName.innerHTML = Playlist[PlaylistKeys[0]].nome
        }
    });

    let contentcontainer = document.getElementById("content-container");

    InfoButton.addEventListener("click", function () {
        if (sideInfo.classList.contains('in')) {
            Sidebar = true;
            sideInfo.classList.remove('in');
            sideInfo.classList.add('out');
            contentcontainer.classList.remove('shrink');
            contentcontainer.classList.add('scale');
        } else {
            sideInfo.classList.remove('out');
            sideInfo.classList.add('in');
            contentcontainer.classList.remove('scale');
            contentcontainer.classList.add('shrink');
            Sidebar = false;
        }
    });
});