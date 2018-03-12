module.exports = function(sequelize, DataTypes) {
  var Player = sequelize.define("Player", {
    score: DataTypes.INTEGER,
    voted: {type: DataTypes.BOOLEAN, defaultValue: DataTypes.false}
  });

  Player.associate = function(models) {
    Player.hasMany(models.Photo);
    Player.hasMany(models.Photo, {
      as: "captionerId"
    });
    Player.belongsTo(models.Game);
  };

  return Player;
};