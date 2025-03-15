const express = require("express")

require('dotenv').config();

//Encriptar Senhas
const bcrypt = require("bcryptjs")

//Salvar Sessões
const jwt = require("jsonwebtoken")
const jwt_secret_key = process.env.JWT_SECRET

//Data-Base And Data Storage
const mongoose = require("mongoose")
const { S3Client } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: 'sa-east-1'
})

//Multer To Handle Archive Storage And Identification
const multer = require("multer")
const multerS3 = require("multer-s3")
const path = require("path")

//Inicialiazing Express And Setting Up CSS;
const site = express();

site.get("/", (req, res) => {
    res.redirect("/dashboard");
});

site.use(express.static(__dirname))
site.use(express.json());

//API Keys
const MongoDBKey = process.env.DATABASE_URL

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'allmusicfiles', // Nome do seu bucket
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const fileExtension = file.originalname.split('.').pop();
            const folderMapping = {
                'mp3': 'audio/',
                'mp4': 'mini-video/',
                'jpg': 'albums/',
                'png': 'albums/'
            };

            const folder = folderMapping[fileExtension] || 'others/';
            const fileName = `${folder}${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        }
    })
});

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
    imagem: { type: String, required: true },
});

const CustomPlaylistSchema = new mongoose.Schema({
    playlists: {
        type: Map,
        of: {
            type: Object,
            default: {}
        }
    }
})

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    playlists: {
        type: Map,
        of: {
            type: Object,
            default: {}
        },
        default: {
            "Músicas Curtidas": {} // Definindo uma playlist vazia chamada "Musicas Curtidas"
        }
    }
});

const Music = mongoose.model('Music', musicSchema);
const User = mongoose.model('User', UserSchema)
const CustomPlaylistMongo = mongoose.model('dailyplaylists', CustomPlaylistSchema)

//Audio Player And Music Submission
site.get('/getmusics', async (req, res) => {
    try {
        const musics = await Music.find();
        res.json(musics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

site.get('/getdailyplaylist', async (req, res) => {
    try {
        const dailyplays = await CustomPlaylistMongo.find();
        res.json(dailyplays);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

site.post('/submitmusic', upload.fields([
    { name: 'audioFile' },
    { name: 'videoFile' },
    { name: 'artistImage' },
    { name: 'albumImage' }
]), async (req, res) => {

    try {
        // Pegando os links dos arquivos que foram enviados para a AWS
        const audioUrl = req.files['audioFile'][0].location;
        const videoUrl = req.files['videoFile'][0].location;
        const artistImageUrl = req.files['artistImage'][0].location;
        const albumImageUrl = req.files['albumImage'][0].location;

        // Criando um novo objeto para salvar no banco de dados
        const newMusic = new Music({
            nome: req.body.name,
            autor: req.body.artist,
            desc: req.body.description,
            src: audioUrl, // Link da AWS S3
            video: videoUrl, // Link da AWS S3
            aboutmeimage: artistImageUrl, // Link da AWS S3
            imagem: albumImageUrl // Link da AWS S3
        });

        // Salvar no MongoDB
        await newMusic.save();
        console.log("Música salva com sucesso!");
        res.json({ message: 'Música salva com sucesso!' });

    } catch (err) {
        console.error('Erro ao salvar música:', err);
        res.status(500).json({ error: err.message });
    }
});

// Login - Register Authentication

async function encryptPassword(senha) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);
    return hashedPassword;
}

//Pages

site.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'registerlandpage.html'));
});

site.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'loginlandpage.html'));
});

site.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

site.get('/*.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'loginlandpage.html'));
});

//User Login And Register / Auth

site.post('/register/createuser', async (req, res) => {
    try {
        console.log("Buscando usuário:", req.body.username); // Verifica se está recebendo corretamente

        const UnicUser = await User.findOne({ username: req.body.username });
        const UnicEmail = await User.findOne({ email: req.body.email });

        if (UnicUser || UnicEmail) {
            console.log("Um Usuário com esse E-mail ou nome já com esse nome!");
            return res.status(400).json({ error: "Usuário já existe!" });
        }

        console.log("Usuário não encontrado, pode criar.");
    } catch (err) {
        console.error("Erro na busca do usuário:", err);
        return res.status(500).json({ error: err.message });
    }

    try {
        const HashedPass = await encryptPassword(req.body.password);
        console.log(HashedPass);

        const NewUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: HashedPass,
        });

        await NewUser.save();
        console.log("Usuário Criado Com Sucesso!");
        res.sendFile(path.join(__dirname, 'index.html'));
        res.status(200)
    } catch (err) {
        console.error('Erro Ao Criar Usuario:', err);
        res.status(500).json({ error: err.message });
    }
});

site.post('/login/trylogin', async (req, res) => {
    try {
        console.log("Buscando email:", req.body.email);

        const RealEmail = await User.findOne({ email: req.body.email })

        if (!RealEmail) {
            console.log("Usuário não encontrado!");
            return res.status(400).json({ error: "Senha Ou Email Incorretos!" });
        }

        const RightPass = await bcrypt.compare(req.body.password, RealEmail.password);

        if (!RightPass) {
            console.log("Senha Incorreta");
            return res.status(400).json({ error: "Senha Ou Email Incorretos!" });
        }

        const token = jwt.sign({ id: RealEmail._id, email: RealEmail.email }, jwt_secret_key, { expiresIn: '7d' });

        res.status(200).json({
            message: 'Usuário autenticado com sucesso!',
            token: token
        });
    } catch (err) {
        console.error("Erro na busca do usuário:", err);
        res.status(500).json({ error: err.message });
    }
});

//Add Music To Selected Playlist
site.post('/addmusictoplaylist', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Pega o token do header

        if (!token) {
            return res.status(401).json({ error: "Token não fornecido!" });
        }

        const decoded = jwt.verify(token, jwt_secret_key);

        const user = await User.findById(decoded.id).select("-password"); // Exclui a senha

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado!" });
        }

        const PlaylistToAdd = req.body.playlist
        const MusicToAddID = req.body.musicId

        if (!user.playlists.has(PlaylistToAdd)) {
            return res.status(404).json({ error: "Playlist Não Encontrada!" });
        }

        const music = await Music.findById(MusicToAddID);
        if (!music) return res.status(404).json({ error: "Música não encontrada" });

        const PlaylistData = user.playlists.get(PlaylistToAdd);
        PlaylistData[MusicToAddID] = {
            nome: music.nome,
            autor: music.autor,
            desc: music.desc,
            src: music.src,
            video: music.video,
            aboutmeimage: music.aboutmeimage,
            imagem: music.imagem,
        }

        await user.save();

        return res.json({ message: "Música adicionada à playlist com sucesso!" });
    } catch (error) {
        console.error("Erro ao adicionar música à playlist:", error);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

site.post('/removemusicfromplaylist', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Token não fornecido!" });
        }

        const decoded = jwt.verify(token, jwt_secret_key);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado!" });
        }

        const SelectedPlaylist = req.body.playlist
        const MusicToRemoveID = req.body.musicid

        if (!user.playlists.has(SelectedPlaylist)) {
            return res.status(404).json({ error: "Playlist Não Encontrada!" });
        }

        const SelectedPlaylistData = user.playlists.get(SelectedPlaylist);

        if (!SelectedPlaylistData[MusicToRemoveID]) {
            return res.status(404).json({ error: "A música não está na playlist!" });
        }

        delete SelectedPlaylistData[MusicToRemoveID];

        user.playlists.set(SelectedPlaylist, SelectedPlaylistData);

        await user.save();

        return res.json({ message: "Música removida da playlist com sucesso!" });
    } catch (error) {
        console.error("Erro ao remover música à playlist:", error);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

//Player Auth And Verifications

site.post('/getcurrentuser', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Pega o token do header

        if (!token) {
            return res.status(401).json({ error: "Token não fornecido!" });
        }

        const decoded = jwt.verify(token, jwt_secret_key);

        const user = await User.findById(decoded.id).select("-password"); // Exclui a senha

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado!" });
        }

        res.status(200).json({
            username: user.username,
            email: user.email,
            playlist: user.playlists
        });

    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

site.post('/createplaylist', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Token não fornecido!" });
        }

        const decoded = jwt.verify(token, jwt_secret_key);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado!" });
        }

        const PlaylistToAdd = req.body.playlist

        if (user.playlists.has(PlaylistToAdd)) {
            return res.status(400).json({ error: "Playlist Ja Existe!" });
        }

        user.playlists.set(PlaylistToAdd, {});

        await user.save();

        return res.json({ message: "Playlist criada com sucesso!" });
    } catch (error) {
        console.error("Erro ao tentar excluir a playlist:", error);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

site.post('/deleteplaylist', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Token não fornecido!" });
        }

        const decoded = jwt.verify(token, jwt_secret_key);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado!" });
        }

        const PlaylistToAdd = req.body.playlist

        if (!user.playlists.has(PlaylistToAdd)) {
            return res.status(404).json({ error: "Playlist Não Encontrada!" });
        }

        user.playlists.delete(PlaylistToAdd)

        await user.save();

        return res.json({ message: "Playlist Excluida Com Sucesso!" });
    } catch (error) {
        console.error("Erro ao tentar excluir a playlist:", error);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

const port = process.env.PORT || 3000;

site.listen(port, '0.0.0.0', () => {
    console.log("Server Online")
});