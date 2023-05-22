// ROUTER MIDDLEWARE FOR SUBPAGE THE GAMES

const express = require('express');
const {resolve} = require('path');

const Router = express.Router();
const filePath = resolve(); 


Router.get('/the-games/rock-paper-scissors', function(req, res) {
    res.sendFile(filePath + '/html_code/rps_game.html')
})

module.exports = Router