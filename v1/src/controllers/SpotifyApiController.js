require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const { AuthError } = require('../scripts/utils/errors');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI  
})
  const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];
class SpotifyApiController{
    
    async getSpotifyAuthUri(req, res){
        let url = spotifyApi.createAuthorizeURL(scopes);
        console.log(url)
        res.json(url);
    }

    async callback(req, res){
        const error = req.query.error;
        const code = req.query.code;
        const state = req.query.state;

        

        if (error) {
            console.error('Callback Error:', error);
            res.send(`Callback Error: ${error}`);
            return;
        }

        spotifyApi
            .authorizationCodeGrant(code)
            .then(data => {
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);
                res.json(data.body);
            }).catch(error => {
                res.json(error);
            });
        }

        async refreshToken(req, res){
            const refresh_token = req.headers.refresh_token;
            spotifyApi.setRefreshToken(refresh_token);
            spotifyApi.refreshAccessToken().then(data => {
                console.log('The access token has been refreshed!');
                console.log('access_token:', data.body['access_token']);
                spotifyApi.setAccessToken(data.body['access_token']);
                res.json(data.body)
            }).catch(error => {
                console.log(error)
                console.log('Could not refresh access token', error)
            });
        }

        async getUserDetails(accessToken){
            spotifyApi.setAccessToken(accessToken);
            const data = await spotifyApi.getMe().catch((error)=>{
                return new AuthError('The access token expired')
            });
            return data
        }

        async getUserProfile(req,res, next){
            const accessToken = req.headers.access_token;
            spotifyApi.setAccessToken(accessToken);
            const data = await spotifyApi.getMe().then((data)=>{
                return res.json(data.body)
            }).catch((error)=>{
                return next(new AuthError('The access token expired'))
            });
        }

        // async createPlaylist(accessToken, name, description, isPublic=true){
        //     spotifyApi.setAccessToken(accessToken);
        //     spotifyApi.createPlaylist(name, { 'description': description, 'public': isPublic }).then((data)=>{
        //         console.log('Created playlist!');
        //         console.log(data.body.id, "playlist id")
        //         return data.body.id
        //     }).catch((error)=>{
        //         return error
        //     });
        // }

        async createPlaylist(accessToken, name, description, isPublic=true) {
            return new Promise((resolve, reject) => {
              spotifyApi.setAccessToken(accessToken);
              spotifyApi.createPlaylist(name, { 'description': description, 'public': isPublic }).then((data) => {
                console.log('Created playlist!');
                resolve(data.body.id);
              }).catch((error) => {
                reject(error);
              });
            });
          }
          

        async searchTrack(accessToken, searchParam){
            spotifyApi.setAccessToken(accessToken);
            const trackId = (await spotifyApi.searchTracks(searchParam)).body.tracks.items[0].id;
            return trackId
        }

        async getUserPlaylists(accessToken, userId){
            spotifyApi.setAccessToken(accessToken);
            const data = await spotifyApi.getUserPlaylists(userId);
            return data.body;
        }

        async addTracksToPlaylist(accessToken, playlistId, tracks){
            spotifyApi.setAccessToken(accessToken);
            spotifyApi.addTracksToPlaylist(playlistId, tracks).then((data)=>{
                return data.body
            }).catch((error)=>{
                return error
            });
        }
}




module.exports = new SpotifyApiController();