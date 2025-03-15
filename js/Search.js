document.addEventListener("DOMContentLoaded", function () {
    let ActualPlaylist = document.getElementById("PlaylistNameLabel");

    let SearchInput = document.getElementById("searchfornewmusicplaylist");
    let SearchOutput = document.getElementById("musiccards");
    let ListOfAllSongs = {};
    let filteredSongs = {};

    // Pegar Todas As Musicas Importadas
    function GetAllSongsInDB() {
        fetch('/getmusics') // Substitua pelo endpoint real da sua API
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar músicas da DB');
                }
                return response.json();
            })
            .then(musics => {
                musics.forEach((music, index) => {
                    const faixaKey = `Faixa${Object.keys(ListOfAllSongs).length + 1}`;
                    ListOfAllSongs[faixaKey] = {
                        id: music._id,
                        src: music.src,
                        nome: music.nome,
                        autor: music.autor,
                        imagem: music.imagem,
                        video: music.video,
                        desc: music.desc,
                        aboutmeimage: music.aboutmeimage
                    };
                });
            })
            .catch(err => {
                console.error("Erro ao buscar músicas da DB:", err.message);
            });
    }

    GetAllSongsInDB()

    function CreateMatch(Song) {
        SearchOutput.innerHTML = "";

        const limitedResults = Object.entries(Song).slice(0, 5);

        limitedResults.forEach(([key, song], index) => {
            const musiclabel = document.createElement("div");
            musiclabel.classList.add("match");

            musiclabel.innerHTML = `
            <img src="${song.imagem}" height="50" width="50" />
            <label>${song.nome}</label>
            <label>${song.autor}</label>
            <button class="addnewmusictoplaylistbutton" data-index="${index}">Add Music</button>
        `;
            musiclabel.innerHTML = `
            <img
              src="${song.imagem}"
              height="50"
              width="50"
            />
            <div class="matchinfo">
              <label id="musicnamematch">${song.nome}</label>
              <button class="addnewmusictoplaylistbutton" data-index="0">
                <img src="icons/addmusic.png" width="20" height="20" />
              </button>
              <br />
              <label id="artistnamematch">${song.autor}</label>
            </div>
            `

            SearchOutput.appendChild(musiclabel);

            const matchButton = musiclabel.querySelector(".addnewmusictoplaylistbutton");

            matchButton.addEventListener("click", function () {
                matchButton.style.cursor = "not-allowed";
                matchButton.disabled = true;
                console.log("Música adicionada:", song.nome, "por", song.autor);
                const token = localStorage.getItem("token");

                fetch("/addmusictoplaylist", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        playlist: ActualPlaylist.innerHTML,
                        musicId: song.id
                    })
                })
                    .then(response => response.json())
                    .then(response => {
                        GetUserAllPlaylist()
                        setTimeout(function () {
                            SetPlaylist(ActualPlaylist.innerText)
                        }, 300);
                        matchButton.style.cursor = "pointer";
                        matchButton.disabled = false;
                    })
                    .catch(error => {
                        console.error("Erro:", error);
                        matchButton.style.cursor = "pointer";
                        matchButton.disabled = false;
                    });
            });
        });
    }

    function FindMatch(RequiredSong) {
        const searchTerm = RequiredSong.toLowerCase().trim(); // Normaliza o termo de busca
        filteredSongs = {}; // Limpa os resultados anteriores

        Object.entries(ListOfAllSongs).forEach(([key, song]) => {
            const loweredname = song.nome.toLowerCase();
            const loweredautor = song.autor.toLowerCase();

            if (loweredname.includes(searchTerm) || loweredautor.includes(searchTerm)) {
                filteredSongs[key] = song;
            }
        });

        CreateMatch(filteredSongs);
    }

    SearchInput.addEventListener("input", function () {
        const inputValue = SearchInput.value.trim();

        if (inputValue === "") {
            SearchOutput.innerHTML = ""; // Apaga os resultados se o input estiver vazio
        } else {
            FindMatch(inputValue);
        }
    });
});