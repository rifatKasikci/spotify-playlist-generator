const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { MusicSuggestion, Spotify } = require('./routes/')
const SpotifyWebApi = require('spotify-web-api-node');
const errorMiddleware = require('./middlewares/errorMiddleware')
require('dotenv').config();
require('express-async-errors')

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    require('./scripts/helpers/openaiHelper').createCompletion('Bana şu özelliklerde şarkı öner : Eğlenceli pop techno').then((response) => {
      let musicArr = response.split('\n');
      musicArr = musicArr.filter((item) => item !== '');
      console.log(musicArr);
      res.json(musicArr);
    });
});

app.use('/api/v1/musics/suggest', MusicSuggestion)
app.use('/api/v1/spotify', Spotify)

app.use(errorMiddleware)

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000')
});