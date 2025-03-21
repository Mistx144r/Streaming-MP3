# Sonar (Streaming-MP3)

<img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHE2MjF5ZzJ2cmoyZjByMG96dng2azJkaWRpMGJxNnBrZW1yOWljMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9UDK779yNcEmaYxXBx/giphy.gif" alt="Gif Login" width="60%" />

Sonar é um aplicativo de **streaming de músicas na nuvem**, oferecendo uma experiência diferenciada ao usuário. Além de permitir o upload de qualquer música para reprodução em qualquer lugar, o Sonar conta com uma interface interativa que inclui um **mini player retrátil** com informações detalhadas sobre a faixa em reprodução, próximas músicas e detalhes sobre o artista, incluindo fotos.

## 🛠️ Tecnologias Utilizadas

- **Back-end:** Express.js (API REST)
- **Banco de Dados:** MongoDB
- **Armazenamento na Nuvem:** AWS S3 (para músicas, vídeos e imagens)
- **Autenticação:** JWT (JSON Web Tokens) para sessões de usuários
- **Criptografia:** Biblioteca para encriptação de senhas (ex: bcrypt)
- **Front-end:** CSS Modules para separação de estilos

## 🗒️ Funcionalidades

- Criar e autenticar contas
- Criar, excluir e gerenciar playlists
- Playlists diárias aleatorias de acordo com seu gosto na aba "Home"
- Adicionar novas músicas ao banco de dados
- Interface interativa com informações sobre a faixa e artista

<img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGN4dWtvajdyc2ZyNHV2a3U5aGZiN3dmcWdxYTZkMHgxcmcxNXQ3MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tJpQHYSD2BrTpWdYhi/giphy.gif" alt="Gif Login" width="60%" />

## 🔄 Melhorias Futuras

- Reorganização manual de músicas dentro das playlists
- Aba para gerenciar todas as músicas no banco de dados (adicionar/remover)
- Outras melhorias na interface e usabilidade

## ⚡ Como Rodar o Projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/Streaming-MP3.git
   cd sonar
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais:
   ```
   DATABASE_URL=URLDAMONGO
   AWS_KEY=SUACHAVE
   AWS_SECRET_ACCESS_KEY=SUASECRETKEYAWS
   JWT_SECRET=SEUJWTSECRET
   ```
4. Execute o servidor:
   ```bash
   npm start
   ```
5. Alternativamente, você pode acessar a versão hospedada no [Railway](https://streaming-mp3-production.up.railway.app/login)

## 👤 Contribuição

Atualmente, **não aceito contribuições diretas**, apenas ideias e sugestões. Se tiver uma ideia, fique à vontade para abrir uma "Issue" ou me contatar!

---

Feito com ❤ por Lucas (Mistx144)

