module.exports = function(sequelize, DataTypes) {
  var Player = sequelize.define("Player", {
    score: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    nickname: DataTypes.STRING,
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