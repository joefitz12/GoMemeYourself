module.exports = function(sequelize, DataTypes) {
  var Player = sequelize.define("Player", {
    score: DataTypes.INTEGER
  });

  Player.associate = function(models) {
    Player.hasMany(models.Photo, {
      as: "playerId"
    });
    Player.hasMany(models.Photo, {
      as: "captionerId"
    });
    Player.belongsTo(models.Game);
  };
  return Player;
};