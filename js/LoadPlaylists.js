document.addEventListener("DOMContentLoaded", function () {
    //Labels
    let PlaylistName = document.getElementById("PlaylistNameLabel");
    let PlaylistUser = document.getElementById("username-playlist");
    let ActualPlaylistLabel = document.getElementById("ActualPlaylistLabel")
    let PlaylistImage = document.getElementById("Playlist-Image");
    let PlaylistNode = document.querySelectorAll(".playlistbutton")

    let SearchDiv = document.getElementById('SearchPlaylistDiv')

    //Playlist Button
    let PlaylistButtonBackground = document.getElementById("sidebarmenuplay")

    //Playlist
    let HomeDiv = document.querySelector(".home-container")
    let PlaylistDiv = document.querySelector(".playlist-container")
    let PlaylistHTML = document.getElementById("playlist-table")
    let SaveRow = document.getElementById("rowheader")

    window.SavedPlaylists = {}

    window.loadedplaylist = null;

    function createPlaylistButton(playlistname) {
        const musiclabel = document.createElement('button');
        musiclabel.classList.add("playlistbutton");
        musiclabel.title = `${playlistname}`

        musiclabel.innerHTML = `
        <img src="imgs/playlist/Liked_Musics.png" height="60" width="60" />
        `

        // Definindo o ID do botão
        musiclabel.id = `${playlistname}`;

        return musiclabel;
    }

    window.GetUserAllPlaylist = async function GetUserAllPlaylist() {
        console.log("Enviando requisição para obter usuário...");

        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Nenhum token encontrado! Usuário não autenticado.");
            return;
        }

        try {
            const response = await fetch("/getcurrentuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao obter usuário.");
            }

            const userData = await response.json();
            console.log("Usuário atual:", userData.username);
            PlaylistUser.innerHTML = userData.username
            window.CurrentUser = userData.username

            window.SavedPlaylists = userData.playlist
            window.PlaylistKeys = Object.keys(window.Playlist);

            ClearPlaylistButtons()

            Object.entries(userData.playlist).forEach(([key, value]) => {
                const PlaylistButtonLabel = createPlaylistButton(key);
                PlaylistButtonBackground.appendChild(PlaylistButtonLabel);
            });

            const currentMusicIndex = window.musicindex;

            setTimeout(() => {
                if (JSON.stringify(window.loadedplaylist) === JSON.stringify(window.Playlist)) {
                    window.musicindex = currentMusicIndex;
                    highlightCurrentSong();
                }
            }, 150);

            console.log(window.SavedPlaylists)

        } catch (error) {
            console.error("Erro ao obter usuário:", error);
        }
    }

    GetUserAllPlaylist()

    function LoadRequiredPlaylist(Name, AppMade) {
        const SelectedPlaylist = window.SavedPlaylists[Name]
        window.loadedplaylist = window.SavedPlaylists[Name]
        PlaylistName.innerText = Name

        Object.entries(SelectedPlaylist).forEach(function ([key, music2], index) {
            const MusicLabel = createMusicLabel(key, music2, index, AppMade);
            PlaylistHTML.appendChild(MusicLabel);
        });
    }

    function createMusicLabel(key, music, index, AppMade) {
        const musiclabel = document.createElement('div');
        musiclabel.classList.add("row");

        if (!AppMade) {
            musiclabel.innerHTML = `
        <div class="numberplay">${index + 1}</div>
        <div class="musicnameinplaylist" id="${key}">${music.nome}</div>
        <div>${music.autor}</div>
        <div>${"Hoje"}</div>
        <div class="duration">...</div>
    `;
        } else {
            musiclabel.innerHTML = `
        <div class="numberplay">${index + 1}</div>
        <div id="${key}">${music.nome}</div>
        <div>${music.autor}</div>
        <div>${"Hoje"}</div>
        <div class="duration">...</div>
    `;
        }

        const NewAudio = new Audio();
        NewAudio.src = music.src;

        NewAudio.addEventListener("loadedmetadata", function () {
            const durationElement = musiclabel.querySelector('.duration');
            if (durationElement) {
                durationElement.textContent = convertTime(NewAudio.duration);
            }
        });

        return musiclabel;
    }

    function ClearPlaylist() {
        PlaylistHTML.innerHTML = "";
        if (SaveRow) {
            PlaylistHTML.appendChild(SaveRow);
        }
    }

    function ClearPlaylistButtons() {
        PlaylistButtonBackground.innerHTML = "";
    }

    var convertTime = function (time) {
        var mins = Math.floor(time / 60);
        if (mins < 10) {
            mins = '0' + String(mins);
        }
        var secs = Math.floor(time % 60);
        if (secs < 10) {
            secs = '0' + String(secs);
        }
        return mins + ':' + secs;
    }

    window.SetPlaylist = function SetPlaylist(ID, Image, AppMade) {
        ClearPlaylist()
        LoadRequiredPlaylist(ID, AppMade)
        if (Image) {
            PlaylistImage.src = Image
        } else {
            PlaylistImage.src = "imgs/playlist/Liked_Musics.png"
        }

        if (AppMade) {
            SearchDiv.style.visibility = "Hidden"
            PlaylistUser.innerText = `Sonar`
        } else {
            SearchDiv.style.visibility = "Visible"
            PlaylistUser.innerText = `${window.CurrentUser}`
        }
    }

    function highlightCurrentSong() {
        document.querySelectorAll('.row').forEach(row => {
            const musicindex = row.children[0].textContent.trim();

            if (musicindex == window.musicindex + 1) {
                row.children[1].style.color = "rgb(129, 0, 141)"
                row.children[1].style.fontWeight = 'bold';
            } else {
                row.children[1].style.color = 'rgb(255, 255, 255)';
                row.children[1].style.fontWeight = 'normal';
            }
        });
    }

    window.ShowHide = function ShowHide(div) {
        if (div == "Home") {
            PlaylistName.innerText = "None"
            HomeDiv.classList.remove("hide")
            PlaylistDiv.classList.add("hide")
            HomeDiv.classList.add("show")
        } else if (div == "Playlist") {
            PlaylistDiv.classList.remove("hide")
            HomeDiv.classList.add("hide")
            PlaylistDiv.classList.add("show")
        }
    }

    document.querySelector(".playlist-table").addEventListener("click", function (event) {
        if (event.target.classList.contains("numberplay")) {
            if (window.loadedplaylist) {
                window.Playlist = window.loadedplaylist;
                ActualPlaylistLabel.innerHTML = PlaylistName.innerText
            }
            window.musicindex = event.target.innerText - 1;
        }
    });

    document.querySelector(".sidebarmenu-container").addEventListener("click", function (event) {
        if (event.target.classList.contains("playlistbutton")) {
            const currentMusicIndex = window.musicindex;

            if (event.target.id == PlaylistName.innerText) {
                console.log("Same Playlist")

            } else {
                ClearPlaylist();
                ShowHide("Playlist")
                SetPlaylist(event.target.id);
            }

            setTimeout(() => {
                if (JSON.stringify(window.loadedplaylist) === JSON.stringify(window.Playlist)) {
                    window.musicindex = currentMusicIndex;
                    highlightCurrentSong();
                }
            }, 150);
        }
    });
});
