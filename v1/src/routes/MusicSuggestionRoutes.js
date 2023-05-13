const router = require('express').Router();
const musicSuggestionController = require('../controllers/MusicSuggestionController');
const {AuthError} = require('../scripts/utils/errors')

router.get('/', musicSuggestionController.getSuggestions);
router.post('/suggestAndAddToPlaylist', musicSuggestionController.suggestAndAddToPlaylist);

module.exports = router;