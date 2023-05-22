// ROUTER MIDDLEWARE FOR MAIN LANDING PAGES

const express = require('express');
const {resolve} = require('path');

const Router = express.Router();
const filePath = resolve(); 


Router.get('/main-page', function(req, res) {
    res.sendFile(filePath + '/html_code/a_main_page.html')
})


Router.get('/the-games', function(req, res) {
    res.sendFile(filePath + '/html_code/b_the_games_page.html')
})


Router.get('/features', function(req, res) {
    res.sendFile(filePath + '/html_code/c_features_page.html')
})


Router.get('/system-requirements', function(req, res) {
    res.sendFile(filePath + '/html_code/d_system_req_page.html')
})


Router.get('/top-scorer', function(req, res) {
    res.sendFile(filePath + '/html_code/e_top_scores_page.html')
})


Router.get('/newsletter', function(req, res) {
    res.sendFile(filePath + '/html_code/f_newsletter_page.html')
})


module.exports = Router