document.addEventListener("DOMContentLoaded", function () {
    const HomeButton = document.getElementById("home-button")
    const DailyPlaylistDiv = document.querySelector(".Homepage-Playlist-Div")
    const CurrentUserLabel = document.getElementById("UserWelcomeMessage")

    async function GetAllDailyPlaylistFromDB() {
        console.log("Enviando requisição para obter usuário...");

        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Nenhum token encontrado! Usuário não autenticado.");
            return;
        }

        try {
            const response = await fetch("/getdailyplaylist", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Erro ao obter usuário.");
            }

            const playlistsdata = await response.json();

            CurrentUserLabel.innerText = window.CurrentUser

            Object.entries(playlistsdata).forEach(([key, value]) => {
                const DailyButtonPlaylist = CreateDailyPlaylistLabel(value, value.nome)
                DailyPlaylistDiv.appendChild(DailyButtonPlaylist);
                window.SavedPlaylists[value.nome] = value.playlists
            });

        } catch (error) {
            console.error("Erro ao obter playlist diarias:", error);
        }
    }

    GetAllDailyPlaylistFromDB()

    function CreateDailyPlaylistLabel(ActualPlaylist, ActualPlaylistName) {
        const PlaylistLabel = document.createElement('button');
        PlaylistLabel.id = `${ActualPlaylistName}`
        let ActualPlaylistKeys = Object.keys(ActualPlaylist.playlists)
        let PrimeiroMusica = ActualPlaylist.playlists[ActualPlaylistKeys[0]]
        let SegundaMusica = ActualPlaylist.playlists[ActualPlaylistKeys[1]]
        let TerceiraMusica = ActualPlaylist.playlists[ActualPlaylistKeys[2]]
        PlaylistLabel.classList.add("Homepage-Playlist-Button");

        PlaylistLabel.innerHTML = `
              <img src="${PrimeiroMusica.imagem}" width="100" height="100" />
              <br />
              <div class="presentartists">
                <label
                  >${PrimeiroMusica.autor}, ${SegundaMusica.autor}, ${TerceiraMusica.autor} e mais</label
                >
              </div>
        `;

        PlaylistLabel.addEventListener('click', function () {
            const currentMusicIndex = window.musicindex;

            SetPlaylist(PlaylistLabel.id, PrimeiroMusica.imagem, true)
            ShowHide("Playlist")

            setTimeout(() => {
                if (JSON.stringify(window.loadedplaylist) === JSON.stringify(window.Playlist)) {
                    window.musicindex = currentMusicIndex;
                    highlightCurrentSong();
                }
            }, 150);
        })

        return PlaylistLabel;
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

    HomeButton.addEventListener("click", function () {
        ShowHide("Home")
    });
});