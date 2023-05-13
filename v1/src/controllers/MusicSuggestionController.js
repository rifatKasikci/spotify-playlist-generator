const { createCompletion } = require('../scripts/helpers/openaiHelper');
const SpotifyApiController = require('../controllers/SpotifyApiController');
const { AuthError } = require('../scripts/utils/errors');

class MusicSuggestionController{

    constructor(musicSuggestionService){
        this.musicSuggestionService = musicSuggestionService;
    }

    async getSuggestions(req, res){
        await createCompletion(`Bana şu özelliklerde şarkı öner : ${'Eğlenceli pop techno'}. Yazdığın metinde sadece öneriler bulunsun ve önerilerini 1,2,3... şeklinde sırala.`).then((response) => {
            let musicArr = response.split('\n');
            musicArr = musicArr.filter((item) => item !== '');
            console.log(musicArr);
            res.json(musicArr);
          });
    }

    getMusicSuggestions = async (prompt) => {
        const musics = await createCompletion(`Bana şu özelliklerde şarkı öner : ${prompt}. Yazdığın metinde sadece öneriler bulunsun ve önerilerini 1,2,3... şeklinde sırala.`)
        let musicArr = musics.split('\n');
        musicArr = musicArr.filter((item) => item !== '');
        return musicArr;
    }

    suggestAndAddToPlaylist = async (req, res, next) => {
        const { playlistName, playlistDescription, isPublic, prompt } = req.body;
        const accessToken = req.headers.access_token
        const user = (await SpotifyApiController.getUserDetails(accessToken))
        if (user instanceof AuthError) {
            return next(user)
        }
        const userId = user.id
        const userPlaylists = (await SpotifyApiController.getUserPlaylists(accessToken, userId)).items
        const playlistExists = userPlaylists.filter((playlist) => playlist.name === playlistName)
        let userPlaylistId = ''
        if(playlistExists.length === 0){
            await SpotifyApiController.createPlaylist(accessToken, playlistName, playlistDescription, isPublic)
            userPlaylistId = (await SpotifyApiController.getUserPlaylists(accessToken, userId)).items[0].id
        }else{
            userPlaylistId = playlistExists[0].id
        }
        const musicsToAdd = await this.getPlaylistTracks(accessToken, prompt)
        console.log(musicsToAdd)
        await SpotifyApiController.addTracksToPlaylist(accessToken, userPlaylistId, musicsToAdd)
        console.log("Added!")
        res.json("Playlist created and songs added.")
    }

    getPlaylistTracks = async (accessToken, prompt) => {
        const musicArr = await this.getMusicSuggestions(prompt);
        let musicsToAdd = [];
        console.log(musicArr);
        for (const music of musicArr) {
          const trackId = await SpotifyApiController.searchTrack(accessToken, music);
          console.log(trackId);
          const trackToAdd = `spotify:track:${trackId}`;
          musicsToAdd.push(trackToAdd);
        }
        return musicsToAdd;
      }


}

module.exports = new MusicSuggestionController();