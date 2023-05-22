// ROUTER MIDDLEWARE FOR ADMIN PAGES 

/* WORKFLOW
1. Admin pages starts from main dashboard API : /admin-dashboard
2. Admin can add data using API /admin-add
3. Admin can add games data using API /admin-add-games
4. Admin can view / read data using API /admin-info, method: get
5. Admin can edit data using API /admin-info, method: post
6. Updated data will be redirect to API /admin-save, before going back to main dashboard
7. Updated games data will be redirect to API /admin-save-add-games, before going back to view/info per user
8. Delete data will using API /admin-delete
*/


// import modules
const express = require('express');
const {resolve} = require('path');

// activate router
const Router = express.Router();

// get modules from files
const filePath = resolve()

// use Built-In Middleware to work with url data
Router.use(express.urlencoded({ extended: false}))


// connect with database
const { user_games, user_game_biodatas, user_game_histories, sequelize, Sequelize } = require(filePath + '/models')
const { col } = Sequelize


// === ROUTING for welcome page if customer succeed login 
Router.get('/admin-dashboard', async function(req, res) { 
    try {
        // get data from database
        let userdata = await user_games.findAll(
            {
                attributes: [
                    'id', 
                    'username',
                    'email',
                    'createdAt',
                    [col('"user_game_biodata"."gender"'), 'gender'],
                    [col('"user_game_biodata"."country"'), 'country']
                ],
                include: [{
                    model: user_game_biodatas,
                    attributes: []
                }]
            });

        userdata = userdata.map(function (data) {
            return data.toJSON()
        })

        // show page
        res.render('superadmin', {userdata: userdata})

    } catch(error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
})



// === ROUTING for welcome page after any data editing
Router.post('/admin-dashboard', async function(req, res) { 
    const transaction = await sequelize.transaction();

    try {
        // get data from user
        const {username, email, ...rest} = req.body
        
        // insert user data to database 
        const addUserGames = await user_games.create({ username, email }, { transaction })

        const userID = addUserGames.id

        await user_game_biodatas.create({...rest, user_id : userID}, { transaction })

        await transaction.commit();

        // get data from database
        let userdata = await user_games.findAll(
            {
                attributes: [
                    'id', 
                    'username',
                    'email',
                    'createdAt',
                    [col('"user_game_biodata"."gender"'), 'gender'],
                    [col('"user_game_biodata"."country"'), 'country']
                ],
                include: [{
                    model: user_game_biodatas,
                    attributes: []
                }]
            });

        userdata = userdata.map(function (data) {
            return data.toJSON()
        })

        // show page
        res.render('superadmin', { userdata: userdata })

    } catch(error) {
        await transaction.rollback()
        console.log(error)

        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(500).json({info: "Adding data failed", error_message: "Email has been registered!"})
        } else {
            res.status(500).send('Internal Server Error')
        }    
    }
})



// === ROUTING for adding data user
Router.get('/admin-add', async function(req, res) {
    res.render ('adminadd')
})



// === ROUTING for adding data games
Router.post('/admin-add-games', async function(req, res) {
    try {
        // get id
        const id = req.query.id

        // get data from database
        let userdata = await user_games.findOne({
            where: { id },
            attributes: [
                'id',
                'username']
            })

        // open page to add games data
        res.render ('adminadd-games', { userdata : userdata.toJSON() })

    } catch(error) {
        console.log(error)
        res.status(500).send('Internal Server Error')    
    }
})



// === ROUTING for read data
Router.get('/admin-info', async function(req, res) {
    try {
        // get id
        const id = req.query.id

        // get data from database
        let userdata = await user_games.findOne({
            where: { id },
            attributes: [
                'id',
                'username',
                'email',
                [col('"user_game_biodata"."gender"'), 'gender'],
                [col('"user_game_biodata"."country"'), 'country']
            ],
            include: [{
                model: user_game_biodatas,
                attributes: []
            }]
        })

        // get data for games 
        let userdataGames = await user_game_histories.findAll({
            where: { user_id : id }
        })

        userdataGames = userdataGames.map(function (data) {
            return data.toJSON()
        })

        // if user doesn't have game history data --> create empty json 
        let emptyUserdataGames = [{
                createdAt: '',
                player_weapon: '',
                computer_weapon: '',
                result: ''
            }]
        

        // send to page admin view
        if (userdataGames.length > 0) {
            res.render ('adminview', {
                userdata: userdata.toJSON(), 
                userdataGames: userdataGames, 
                isUpdated: false
            })
        } else {
            res.render ('adminview', {
                userdata: userdata.toJSON(), 
                userdataGames: emptyUserdataGames, 
                isUpdated: false
            })
        }
        
    } catch(error) {
        console.log(error)
        res.status(500).send('Internal Server Error')    
    }
})



// === ROUTING for edit data
Router.post('/admin-info', async function(req, res) {
    try {
        // get id
        const id = req.query.id

        // get data from database
        let userdata = await user_games.findOne({
            where: { id },
            attributes: [
                'id',
                'username',
                'email',
                [col('"user_game_biodata"."gender"'), 'gender'],
                [col('"user_game_biodata"."country"'), 'country']
            ],
            include: [{
                model: user_game_biodatas,
                attributes: []
            }]
        })

        // get data for games 
        let userdataGames = await user_game_histories.findAll({
            where: { user_id : userdata.toJSON().id }
        })

        userdataGames = userdataGames.map(function (data) {
            return data.toJSON()
        })

        // if user doesn't have game history data --> create empty json 
        let emptyUserdataGames = [{
                createdAt: '',
                player_weapon: '',
                computer_weapon: '',
                result: ''
            }]

        // send to page admin view
        if (userdataGames.length > 0) {
            res.render ('adminview', {
                userdata: userdata.toJSON(), 
                userdataGames: userdataGames, 
                isUpdated: true
            })
        } else {
            res.render ('adminview', {
                userdata: userdata.toJSON(), 
                userdataGames: emptyUserdataGames, 
                isUpdated: true
            })
        }
    
    } catch(error) {
        console.log(error)
        res.status(500).send('Internal Server Error')    
    }
})



// === ROUTING for saving data
Router.post('/admin-save', async function(req, res) {
    const transaction = await sequelize.transaction();

    try {
        const { id, username, email, gender, country } = req.body;
        
        // save to  database
        await user_games.update(
            { username, email },
            { where: {id} },
            { transaction }
        );
        
        await user_game_biodatas.update(
            { gender, country },
            { where: {user_id: id} },
            { transaction }
        );

        await transaction.commit();

        // show main dashboard page
        res.redirect("/admin-dashboard")

    } catch(error) {
        await transaction.rollback()

        console.log(error)
        res.status(500).send('Internal Server Error')    
    }
})




// === ROUTING for updating data
Router.post('/admin-save-add-games', async function(req, res) {
    try {
        // get data from user 
        const { player_weapon, computer_weapon, result } = req.body

        // get data from database
        let userdata = await user_games.findOne({
            where: { id : req.query.id },
            attributes: [
                'id',
                'username',
                'email',
                [col('"user_game_biodata"."gender"'), 'gender'],
                [col('"user_game_biodata"."country"'), 'country']
            ],
            include: [{
                model: user_game_biodatas,
                attributes: []
            }]
        })

        // add  data on database
        await user_game_histories.create(
            {
              player_weapon: player_weapon,
              computer_weapon: computer_weapon,
              result: result,
              user_id: userdata.toJSON().id
            }
        );
        
        // get data for games 
        let userdataGames = await user_game_histories.findAll({
            where: { user_id : userdata.toJSON().id }
        })
        userdataGames = userdataGames.map(function (data) {
            return data.toJSON()
        })

        // show user info page 
        res.render ('adminview', {
            userdata: userdata.toJSON(), 
            userdataGames: userdataGames, 
            isUpdated: true
        })
    
    } catch(error) {
        console.log(error)
        res.status(500).send('Internal Server Error')    
    }
})




// === ROUTING for delete data
Router.post('/admin-delete', async function(req, res) {
    const transaction = await sequelize.transaction();
    try {
        // update data on database
        await user_game_histories.destroy({where: { user_id: req.query.id }}, { transaction });
        await user_game_biodatas.destroy({where: { user_id: req.query.id }}, { transaction });
        await user_games.destroy({where: { id: req.query.id }}, { transaction });
        await transaction.commit();

        // show main dashboard
        res.redirect("/admin-dashboard")
    } catch(error) {
        await transaction.rollback()

        console.log(error)
        res.status(500).send('Internal Server Error')    
    }
})



module.exports = Router






