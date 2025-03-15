//Data-Base And Data Storage
const mongoose = require("mongoose")

//API Keys
const MongoDBKey = 'mongodb+srv://lucasmendonca:jrpzU5TZOXMZP4AG@cluster0.ud40s.mongodb.net/'

mongoose.connect(MongoDBKey,)
    .then(() => console.log('Conectado ao MongoDB'))

    .catch((err) => console.log('Erro ao conectar ao MongoDB:', err));

//MongoDB Schemas
const musicSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    autor: { type: String, required: true },
    desc: { type: String, required: true },
    src: { type: String, required: true },
    video: { type: String, required: true },
    aboutmeimage: { type: String, required: true },
    imagem: { type: String, required: true }
});

const CustomPlaylistSchema = new mongoose.Schema({
    nome: String,
    playlists: {
        type: Map,
        of: {
            type: Object,
            default: {}
        }
    }
})

const Music = mongoose.model('Music', musicSchema);
const CustomPlaylistMongo = mongoose.model('dailyplaylists', CustomPlaylistSchema)

let AllDBSongs = {}

async function GetAllMusics() {
    try {
        const musics = await Music.find();
        AllDBSongs = musics
        GenerateMinutedPlaylist(6)
    } catch (err) {
        console.log(err)
    }
}

GetAllMusics()

function RandomizeMusics() {
    let LastMusicIndexes = []

    for (let i = 0; i < 12; i++) {
        let MaxIndex = Object.keys(AllDBSongs).length
        let RandomIndex = Math.floor(Math.random() * MaxIndex)

        while (LastMusicIndexes.includes(RandomIndex)) {
            RandomIndex = Math.floor(Math.random() * MaxIndex)
        }

        LastMusicIndexes.push(RandomIndex)
    }

    return LastMusicIndexes
}

async function ClearDB() {
    try {
        await CustomPlaylistMongo.deleteMany({});
        console.log("Banco de dados limpo com sucesso");
    } catch (err) {
        console.error("Erro ao limpar o banco de dados:", err);
    }
}

async function GenerateMinutedPlaylist(DoXTimes) {
    await ClearDB()

    for (let i = 0; i < DoXTimes; i++) {
        let RandomTable = RandomizeMusics()
        let CustomPlaylist = {}

        RandomTable.forEach(MusicIndex => {
            let CustomPlaylistKeys = Object.keys(CustomPlaylist)
            CustomPlaylist[`Faixa ${CustomPlaylistKeys.length + 1}`] = AllDBSongs[MusicIndex]
        })

        const newPlaylist = new CustomPlaylistMongo({
            nome: `Daily Mix ${i + 1}`,
            playlists: CustomPlaylist
        });

        try {
            await newPlaylist.save();
            console.log("Playlist salva com sucesso");
        } catch (err) {
            console.error("Erro ao salvar a playlist:", err);
        }
    }
}

async function GenerateDailyPlaylist() {
    try {
        console.log("Executando a função diária em:", new Date().toLocaleString());

        const agora = new Date();
        const proximoDia = new Date(agora);
        proximoDia.setDate(agora.getDate() + 1);
        proximoDia.setHours(0, 0, 0, 0);

        const tempoAteProximaExecucao = proximoDia - agora;
        console.log(`Próxima execução em: ${tempoAteProximaExecucao / 1000 / 60} minutos`);

        await new Promise(resolve => setTimeout(resolve, tempoAteProximaExecucao));

        GenerateDailyPlaylist();
    } catch (error) {
        console.error("Erro na execução diária:", error);
    }
}