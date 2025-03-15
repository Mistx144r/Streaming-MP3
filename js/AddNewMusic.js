document.addEventListener("DOMContentLoaded", function () {
    let CreateNewMusicButton = document.getElementById("submitMusicBtn");
    let OpenDialog = document.getElementById("DialogNewMusic")
    let OpenDialogButton = document.getElementById("submitmusic-button")

    OpenDialogButton.addEventListener("click", function () {
        if (OpenDialog.open) {
            OpenDialog.close(); // Fecha o dialog se ele já estiver aberto
        } else {
            OpenDialog.showModal(); // Abre o dialog no modo modal
        }
    });

    CreateNewMusicButton.addEventListener("click", function () {
        const name = document.getElementById('NewNameMusicSubmit').value;
        const artist = document.getElementById('NewArtistMusicSubmit').value;
        const description = document.getElementById('NewDescMusicSubmit').value;
        const audioFile = document.getElementById('NewAudioMusicSubmit').files[0];
        const videoFile = document.getElementById('NewVideoMusicSubmit').files[0];
        const artistImage = document.getElementById('NewImageAboutArtistMusicSubmit').files[0];
        const albumImage = document.getElementById('NewAlbumImageSubmit').files[0];

        const formData = new FormData();
        formData.append('name', name);
        formData.append('artist', artist);
        formData.append('description', description);
        formData.append('audioFile', audioFile);
        formData.append('videoFile', videoFile);
        formData.append('artistImage', artistImage);
        formData.append('albumImage', albumImage);

        fetch('/submitmusic', {
            method: 'POST',
            body: formData
        }).then(() => {
            location.replace(location.href);
        });
    });
});