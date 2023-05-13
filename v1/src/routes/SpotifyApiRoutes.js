const router = require('express').Router();
const spotifyApiController = require('../controllers/SpotifyApiController');

router.get('/getSpotifyAuthUri', spotifyApiController.getSpotifyAuthUri);
router.get('/callback', spotifyApiController.callback);
router.get('/userPlaylists', spotifyApiController.getUserPlaylists);
router.post('/refreshToken', spotifyApiController.refreshToken); 
router.post('/getUserDetails', spotifyApiController.getUserProfile);
router.post('/createPlaylist', spotifyApiController.createPlaylist);
router.post('/addTracksToPlaylist', spotifyApiController.addTracksToPlaylist);
router.post('/searchTrack', spotifyApiController.searchTrack);


module.exports = router;
