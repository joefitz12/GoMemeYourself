module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define("Game", {
    round: DataTypes.INTEGER
  });

  Game.associate = function(models) {
    Game.hasMany(models.Player, {
      onDelete: "cascade"
    });
    Game.hasMany(models.Photo, {
      onDelete: "cascade"
    });
  };
  return Game;
};