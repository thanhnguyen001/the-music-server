const express = require('express');
const router = express.Router();
const ZingMp3Controller = require('../app/Controller/ZingMp3Controller');

// var bodyParser = require('body-parser')

// var jsonParser = bodyParser.json();

router.post('/home', ZingMp3Controller.getArtistPlaylistSong);
router.post('/genre', ZingMp3Controller.getArtistPlaylistSong);
router.post('/multi', ZingMp3Controller.getArtistPlaylistSong);
router.post('/search', ZingMp3Controller.getArtistPlaylistSong);
router.post('/top100', ZingMp3Controller.getArtistPlaylistSong);
router.post('/counter', ZingMp3Controller.getArtistPlaylistSong);
router.post('/suggest', ZingMp3Controller.getArtistPlaylistSong);
router.post('/song/:id', ZingMp3Controller.getArtistPlaylistSong);
router.post('/video/:id', ZingMp3Controller.getArtistPlaylistSong);
router.post('/song-info/:id', ZingMp3Controller.getArtistPlaylistSong);
router.post('/recommend/:id', ZingMp3Controller.getArtistPlaylistSong);
router.post('/newrelease', ZingMp3Controller.getArtistPlaylistSong);
router.post('/lyrics/:id', ZingMp3Controller.getArtistPlaylistSong);
router.post('/artist/:alias', ZingMp3Controller.getArtistPlaylistSong);
router.post('/section-bottom/:id', ZingMp3Controller.getArtistPlaylistSong);
router.post('/album/:albumName/:id', ZingMp3Controller.getArtistPlaylistSong);
router.post('/playlist/:albumName/:id', ZingMp3Controller.getArtistPlaylistSong);
router.post('/test', ZingMp3Controller.getArtistPlaylistSong);

module.exports = router;