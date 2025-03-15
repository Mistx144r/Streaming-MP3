document.addEventListener("DOMContentLoaded", function () {
    const contextMenu = document.querySelector(".contextmenuplaylist")
    let ActualPlaylistName = document.getElementById("PlaylistNameLabel");
    contextMenu.style.visibility = "hidden"

    //Labels
    let MusicName = document.getElementById("MusicLabel");
    let Artist = document.getElementById("Artista");
    let AlbumImage = document.getElementById("AlbumPng");
    let MusicClip = document.getElementById("VideoClip");
    let MusicTime = document.getElementById("MusicTime");
    let MinutagemAtual = document.getElementById("MinutagemAtual");
    let MinutagemTotal = document.getElementById("MinutagemTotal");
    let musicaudio = document.getElementById("PlayingMusic");

    let ActualMusicPlaylist = document.getElementById("ActualPlaylistLabel");

    //SideInfo
    let ArtistAboutMeName = document.getElementById("ArtistAboutMeName")
    let desc = document.getElementById("Desc")
    let artistpng = document.getElementById("ArtistImage")

    let SelectedPlaylist = null;

    async function DeletedSelectedPlaylist(PlaylistName) {
        console.log("Enviando requisição para obter usuário...");

        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Nenhum token encontrado! Usuário não autenticado.");
            return;
        }

        try {
            const response = await fetch("/deleteplaylist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    playlist: PlaylistName,
                })
            });

            if (!response.ok) {
                throw new Error("Erro ao obter usuário.");
            }

            GetUserAllPlaylist()

            if (ActualMusicPlaylist.innerText === PlaylistName) {
                window.Playlist = {}
                musicaudio.src = '';
                MusicClip.src = 'videos/NoMusicVid.mp4';
                MinutagemAtual.innerText = '00:00'
                MinutagemTotal.innerText = '00:00'
                AlbumImage.src = 'imgs/NoSong.jpg';
                Artist.innerText = 'None';
                MusicName.innerText = 'None';
                ArtistAboutMeName = 'None';
                desc.innerText = '';
                artistpng.src = 'icons/NoAbout.png';
                ActualMusicPlaylist.innerText = "None"


                setTimeout(function () {
                    MusicTime.value = 0;
                }, 100);
            }

            if (PlaylistName === ActualPlaylistName.innerText) {
                setTimeout(function () {
                    SetPlaylist("Músicas Curtidas")
                }, 150);
            }

        } catch (error) {
            console.error("Erro ao obter usuário:", error);
        }
    }

    const updateMenuPos = (x, y) => {
        const maxLeftVal = window.innerWidth - contextMenu.offsetWidth;
        const maxTopVal = window.innerHeight - contextMenu.offsetHeight;

        contextMenu.style.left = `${Math.min(maxLeftVal, x)}px`
        contextMenu.style.top = `${Math.min(maxTopVal, y)}px`
    }

    document.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();

        contextMenu.classList.remove('scale');
        contextMenu.style.visibility = "hidden";

        if (ev.target.classList.contains('playlistbutton') && ev.target.id != "Músicas Curtidas") {
            contextMenu.style.visibility = "visible";

            contextMenu.classList.add('scale');

            SelectedPlaylist = ev.target
            updateMenuPos(ev.clientX, ev.clientY);
        }
    });

    document.addEventListener("click", () => {
        contextMenu.classList.remove('scale');
        contextMenu.style.visibility = "hidden";
        SelectedPlaylist = null;
    })

    document.addEventListener("keydown", (keydown) => {
        if (keydown.key == "Escape" && contextMenu.style.visibility == "visible") {
            contextMenu.classList.remove('scale');
            contextMenu.style.visibility = "hidden";
            SelectedPlaylist = null;
        }
    })

    document.querySelector("#OpenPlaylist").addEventListener('click', (ev) => {
        ShowHide("Playlist")
        SetPlaylist(SelectedPlaylist.title)
    })

    document.querySelector("#ChangePlaylistImage").addEventListener('click', () => {
        alert("Change Playlist Image")
    })

    document.querySelector("#DeletePlaylist").addEventListener('click', () => {
        DeletedSelectedPlaylist(SelectedPlaylist.title)
    })
});
