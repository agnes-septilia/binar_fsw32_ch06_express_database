'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_game_historie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_game_historie.init({
    user_id: DataTypes.UUID,
    player_weapon: DataTypes.STRING,
    computer_weapon: DataTypes.STRING,
    result: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user_game_histories',
    tableName: 'user_game_histories',
    underscored: true,
    updatedAt: false
  });
  return user_game_historie;
};