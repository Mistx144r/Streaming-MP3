document.addEventListener("DOMContentLoaded", function () {
    //Labels
    let MusicName = document.getElementById("MusicLabel");
    let Artist = document.getElementById("Artista");
    let AlbumImage = document.getElementById("AlbumPng");
    let MusicClip = document.getElementById("VideoClip");
    let MinutagemAtual = document.getElementById("MinutagemAtual");
    let MinutagemTotal = document.getElementById("MinutagemTotal");

    //Audio
    let musicaudio = document.getElementById("PlayingMusic");

    //Playlist
    let PlaylistHTML = document.getElementById("playlist-table")
    let ActualPlaylistLabel = document.getElementById("ActualPlaylistLabel")
    let PlaylistName = document.getElementById("PlaylistNameLabel");

    //Buttons
    let PlayButton = document.getElementById("PlayPause");
    let VolumeSlider = document.getElementById("Volume");
    let Shuffle = document.getElementById("Shuffle");
    let MusicTime = document.getElementById("MusicTime");
    let NextMusicButton = document.getElementById("NextMusic");
    let PreviousMusicButton = document.getElementById("ReturnMusic");
    let LoopButton = document.getElementById("LoopMusic");
    let MuteButton = document.getElementById("MuteButton")

    // Disable Free Scroll.
    document.addEventListener('mousedown', function (e) {
        if (e.button === 1) {
            e.preventDefault(); // Previne (rolagem multidirecional)
        }
    });

    //Space To Pause And Play The Song.
    document.addEventListener("keypress", function (e) {
        console.log(e.key)

        if (e.key == " " && !isTyping()) {
            e.preventDefault();
            PlayPauseMusic();
        }
    });

    //Preventing User From Pressing Tab
    document.addEventListener("keydown", function (event) {
        if (event.key === "Tab") {
            event.preventDefault();
            console.log("TAB pressionado, mas a navegação foi bloqueada!");
        }
    });

    //Verify If The User Is Typing On The Site.
    function isTyping() {
        const activeElement = document.activeElement;
        return activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA";
    }

    // Sleep (TimeOut) Function
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //Playlists Logic
    window.musicindex = 0;

    var looped = false;
    var shufflemusic = false;

    //Actual Global Playlist
    window.Playlist = {
    };

    window.PlaylistKeys = Object.keys(Playlist);

    //Highlight The Current Playing Music / Song.
    function highlightCurrentSong() {
        document.querySelectorAll('.row').forEach(row => {
            const musicindex = row.children[0].textContent.trim();
            const same = PlaylistName.innerText == ActualPlaylistLabel.innerText

            if (musicindex == window.musicindex + 1 && same) {
                row.children[1].style.color = "rgb(129, 0, 141)"
                row.children[1].style.fontWeight = 'bold';
            } else {
                row.children[1].style.color = 'rgb(255, 255, 255)';
                row.children[1].style.fontWeight = 'normal';
            }
        });
    }

    // Change Music Debounce
    var changingmusic = false;

    //Shuffle Array
    const lastsongsindexes = []

    // Plays The Next Playlist Song And Checks If The User Enabled Shuffle Or Loop.
    function NextMusic(auto) {
        if (looped && auto) {
            return
        }

        // Shuffle Music Logic!
        //This Function Randomize A Value Between 1 And The "Lenght Of The Playlist" (All Songs)
        //And Plays If Its Not Any Of The Song 3 Songs Played Earlier. (Updates On Every Song Played)
        if (shufflemusic) {
            window.PlaylistKeys = Object.keys(Playlist);

            if (window.PlaylistKeys.length > 5) {
                lastsongsindexes.push(window.musicindex);

                if (lastsongsindexes.length > 5) {
                    lastsongsindexes.shift();
                }
            }

            let RandomMusicIndex;

            do {
                RandomMusicIndex = Math.floor(Math.random() * window.PlaylistKeys.length);
            } while (
                RandomMusicIndex === window.musicindex ||
                lastsongsindexes.includes(RandomMusicIndex)
            );

            window.musicindex = RandomMusicIndex;

            console.log("Últimas músicas:", lastsongsindexes);

            MinutagemAtual.innerHTML = "00:00";
            changingmusic = true;
            MusicTime.value = 0;

            musicaudio.src = Playlist[window.PlaylistKeys[RandomMusicIndex]].src;

            PlayPauseMusic();
            highlightCurrentSong();

            setTimeout(() => {
                changingmusic = false;
            }, 500);

            return;
        }

        MinutagemAtual.innerHTML = "00:00"
        changingmusic = true
        MusicTime.value = 0;
        window.PlaylistKeys = Object.keys(Playlist);
        window.musicindex++;

        if (window.musicindex >= Object.keys(Playlist).length && !auto) {
            window.musicindex = 0;
        }
        console.log(window.PlaylistKeys)
        musicaudio.src = Playlist[PlaylistKeys[window.musicindex]].src;
        PlayPauseMusic();
        highlightCurrentSong()
        sleep(200).then(() => {
            changingmusic = false;
        });
    }

    // Plays The Previous Playlist Song And Checks If The User Enabled Shuffle Or Loop.
    function PreviousMusic() {
        MinutagemAtual.innerHTML = "00:00"
        changingmusic = true
        MusicTime.value = 0;
        window.PlaylistKeys = Object.keys(Playlist);
        window.musicindex--;
        if (window.musicindex < Object.keys(Playlist).length && window.musicindex < 0) {
            window.musicindex = Object.keys(Playlist).length - 1
        }
        musicaudio.src = Playlist[PlaylistKeys[window.musicindex]].src;
        sleep(200).then(() => {
            changingmusic = false;
        });
    }

    // Set The Default Volume Value To 20%. 
    musicaudio.volume = VolumeSlider.value / 100;

    // Variable To Know When The User Is Holding The Time Bar Handle.
    var Holding = false;


    // Time Bar Logic!
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

    musicaudio.addEventListener("timeupdate", function () {
        if (!Holding && !changingmusic) {
            MusicTime.value = (musicaudio.currentTime / musicaudio.duration) * 100;
            MinutagemAtual.innerHTML = convertTime(musicaudio.currentTime)
        }
    });

    MusicTime.addEventListener("input", function () {
        Holding = true;
        let tempcurrenttime = (MusicTime.value / 100) * musicaudio.duration;
        MinutagemAtual.innerHTML = convertTime(tempcurrenttime)
    });

    MusicTime.addEventListener("change", function () {
        musicaudio.currentTime = (MusicTime.value / 100) * musicaudio.duration;
        Holding = false;
    });

    musicaudio.addEventListener("ended", function () {
        if (window.musicindex < Object.keys(Playlist).length && !looped) {
            NextMusic();
        }

        if (looped) {
            PlayPauseMusic();
        }
        MinutagemAtual.innerHTML = "00:00"
        MusicTime.value = 0;
    });

    // Volume Ranger And Volume Vars
    let volumeObj = { volume: musicaudio.volume };
    let ActualVolume = VolumeSlider.value / 100;
    let LastVolume = VolumeSlider.value / 100;

    var debounce = true;
    var muted = false;

    function Mute() {
        const MutedImage = document.querySelector("#MuteButton img");

        if (!muted) {
            muted = true;
            if (VolumeSlider.value > 0) {
                LastVolume = VolumeSlider.value / 100;
            }
            ActualVolume = 0;
            musicaudio.volume = ActualVolume;
            VolumeSlider.value = 0;
            MutedImage.src = "icons/VolumeMuted.png";
        } else {
            muted = false;
            ActualVolume = LastVolume;
            musicaudio.volume = LastVolume;
            VolumeSlider.value = LastVolume * 100;
            MutedImage.src = "icons/VolumeOn.png";
        }
    }

    VolumeSlider.addEventListener("input", function () {
        const MutedImage = document.querySelector("#MuteButton img");

        if (debounce) {
            musicaudio.volume = ActualVolume;
        }

        if (VolumeSlider.value == 0) {
            muted = true;
            MutedImage.src = "icons/VolumeMuted.png";
            ActualVolume = 0;
            musicaudio.volume = ActualVolume;
        } else {
            muted = false;
            MutedImage.src = "icons/VolumeOn.png";
            ActualVolume = VolumeSlider.value / 100;
        }
    });

    MuteButton.addEventListener("click", function () {
        Mute();
    });

    // Play And Pause Functions

    window.addEventListener('keydown', function () { if (event.keyCode == 32) { document.body.style.overflow = "hidden"; } });

    function PlayPauseMusic() {
        const PlayButtonImage = document.querySelector("#PlayPause img");
        if (musicaudio.paused && debounce) {
            debounce = false;
            PlayButtonImage.src = "icons/Pause_White.png";
            musicaudio.play();
            gsap.to(volumeObj, {
                volume: ActualVolume,
                duration: 0.35,
                onUpdate: () => {
                    musicaudio.volume = volumeObj.volume;
                    MusicClip.play();
                },
                onComplete: () => {
                    debounce = true;
                }
            });
        } else if (!musicaudio.paused && debounce) {
            debounce = false;
            PlayButtonImage.src = "icons/Play_White.png";
            MusicClip.pause();
            gsap.to(volumeObj, {
                volume: 0,
                duration: 0.35,
                onUpdate: () => {
                    musicaudio.volume = volumeObj.volume;
                },
                onComplete: () => {
                    musicaudio.pause();
                    debounce = true;
                }
            });
        }
    };

    PlayButton.addEventListener("click", function () {
        PlayPauseMusic();
    });

    document.querySelector(".playlist-table").addEventListener("click", function (event) {
        if (event.target.classList.contains("numberplay")) {
            if (changingmusic == false) {
                sleep(100).then(() => {
                    MinutagemAtual.innerHTML = "00:00"

                    changingmusic = true;
                    window.PlaylistKeys = Object.keys(Playlist);
                    musicaudio.src = Playlist[PlaylistKeys[window.musicindex]].src;
                    MusicTime.value = 0;

                    sleep(500).then(() => {
                        changingmusic = false;
                    });
                });
            }
        }
    });

    // Change Music Function
    NextMusicButton.addEventListener("click", function () {
        if (debounce) {
            NextMusic();
        }
    });

    PreviousMusicButton.addEventListener("click", function () {
        if (debounce) {
            PreviousMusic();
        }
    });

    //Load All The Music Data From The Data Base And Set On Screen To The User.
    musicaudio.addEventListener("loadedmetadata", function () {
        if (changingmusic == true) {
            PlayPauseMusic();
            highlightCurrentSong()
        }
        MusicName.innerHTML = Playlist[PlaylistKeys[window.musicindex]].nome
        Artist.innerHTML = Playlist[PlaylistKeys[window.musicindex]].autor
        AlbumImage.src = Playlist[PlaylistKeys[window.musicindex]].imagem
        MinutagemTotal.innerHTML = convertTime(musicaudio.duration)

        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: Playlist[PlaylistKeys[window.musicindex]].nome,
                artist: Playlist[PlaylistKeys[window.musicindex]].autor,
                album: ActualPlaylistLabel.innerText,
                artwork: [
                    { src: Playlist[PlaylistKeys[window.musicindex]].imagem, sizes: "512x512", type: "image/png" }
                ]
            });

            navigator.mediaSession.setActionHandler("play", () => {
                PlayPauseMusic()
            });

            navigator.mediaSession.setActionHandler("pause", () => {
                PlayPauseMusic()
            });

            navigator.mediaSession.setActionHandler("nexttrack", () => {
                NextMusic()
            });

            navigator.mediaSession.setActionHandler("previoustrack", () => {
                PreviousMusic()
            });

            console.log("Media Session API configurada!");
        }
    });

    //Loop Music
    LoopButton.addEventListener("click", function () {
        const LoopImage = document.querySelector("#LoopMusic img");

        if (!looped) {
            looped = true
            LoopImage.src = "icons/LoopOn.png"
            musicaudio.looped = true;
        } else {
            looped = false
            LoopImage.src = "icons/Loop.png"
            musicaudio.looped = false;
        }
    });

    //Shuffle Playlist
    Shuffle.addEventListener('click', function () {
        const ShuffleImage = document.querySelector("#Shuffle img");

        if (!shufflemusic) {
            shufflemusic = true
            ShuffleImage.src = "icons/ShuffleOn.png"
        } else {
            shufflemusic = false
            ShuffleImage.src = "icons/Shuffle.png"
        }
    })

    if (window.Worker) {
        // Cria o Web Worker
        const worker = new Worker('js/keepwebalive.js');

        worker.onmessage = function (event) {
            if (event.data === 'keep-alive') {
                console.log('Worker ativo! Impedindo suspensão...');
            }
        };
    } else {
        console.log('Seu navegador não suporta Web Workers!');
    }
});