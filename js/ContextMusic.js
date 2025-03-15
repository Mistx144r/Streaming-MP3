document.addEventListener("DOMContentLoaded", function () {
    const contextMenu = document.querySelector(".MusicContext")
    const ActualPlaylistName = document.getElementById("PlaylistNameLabel");

    contextMenu.style.visibility = "hidden"

    let SelectedMusic = null;

    const updateMenuPos = (x, y) => {
        const maxLeftVal = window.innerWidth - contextMenu.offsetWidth;
        const maxTopVal = window.innerHeight - contextMenu.offsetHeight;

        contextMenu.style.left = `${Math.min(maxLeftVal, x)}px`
        contextMenu.style.top = `${Math.min(maxTopVal, y)}px`
    }

    async function DeleteMusicFromPlaylist(MusicId, ActualPlaylist) {
        console.log("Enviando requisição para obter usuário...");

        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Nenhum token encontrado! Usuário não autenticado.");
            return;
        }

        try {
            const response = await fetch("/removemusicfromplaylist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    playlist: ActualPlaylist,
                    musicid: MusicId
                })
            });

            if (!response.ok) {
                throw new Error("Erro ao obter usuário.");
            }

            GetUserAllPlaylist()
            setTimeout(function () {
                SetPlaylist(ActualPlaylistName.innerText)
            }, 150);

        } catch (error) {
            console.error("Erro ao obter usuário:", error);
        }
    }

    document.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();

        contextMenu.classList.remove('scale');
        contextMenu.style.visibility = "hidden";

        if (ev.target.classList.contains('musicnameinplaylist')) {
            contextMenu.style.visibility = "visible";
            contextMenu.classList.remove('scale');

            setTimeout(() => {
                contextMenu.classList.add('scale');
            }, 10);

            SelectedMusic = ev.target;

            updateMenuPos(ev.clientX, ev.clientY);
        }
    });

    document.addEventListener("click", () => {
        contextMenu.classList.remove('scale');
        contextMenu.style.visibility = "hidden";
        SelectedMusic = null;
    })

    document.addEventListener("keydown", (keydown) => {
        if (keydown.key == "Escape" && contextMenu.style.visibility == "visible") {
            contextMenu.classList.remove('scale');
            contextMenu.style.visibility = "hidden";
            SelectedMusic = null;
        }
    })

    document.querySelector("#DeleteMusic").addEventListener('click', () => {
        const SelectedMusicId = SelectedMusic.parentNode.children[1].id;
        DeleteMusicFromPlaylist(SelectedMusicId, ActualPlaylistName.innerText)
    })
});
