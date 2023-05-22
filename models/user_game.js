'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_game.hasOne(models.user_game_biodatas, {foreignKey: 'user_id'});
      user_game.hasMany(models.user_game_histories, {foreignKey: 'user_id'});

    }
  }
  user_game.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image_filename: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user_games',
    tableName: 'user_games',
    underscored: true
  });
  return user_game;
};