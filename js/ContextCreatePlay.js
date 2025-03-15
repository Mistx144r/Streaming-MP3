document.addEventListener("DOMContentLoaded", function () {
    const contextMenu = document.querySelector(".contextmenuplaylistcreation")
    const Dialog = document.getElementById("DialogNewPlaylist")

    const NewPlaylistNameInput = document.getElementById('NewPlaylistName');
    const Submit = document.getElementById("submitMusicBtnPlay");

    contextMenu.style.visibility = "hidden"

    let SelectedPlaylist = null;

    async function CreateNewPlaylist(PlaylistName) {
        console.log("Enviando requisição para obter usuário...");

        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Nenhum token encontrado! Usuário não autenticado.");
            return;
        }

        try {
            const response = await fetch("/createplaylist", {
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
            OpenPlaylistCreator()


        } catch (error) {
            console.error("Erro ao obter usuário:", error);
        }
    }

    function OpenPlaylistCreator() {
        if (Dialog.open) {
            Dialog.close();
        } else {
            Dialog.showModal();
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

        if (ev.target.classList.contains('sidebarmenu-container')) {
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

    document.querySelector("#CreatePlaylist").addEventListener('click', () => {
        OpenPlaylistCreator()
        console.log(SelectedPlaylist)
    })

    Submit.addEventListener('click', function () {
        CreateNewPlaylist(NewPlaylistNameInput.value)
    })
});
