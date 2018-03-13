module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("Photo", {
    score: DataTypes.INTEGER,
    caption: DataTypes.STRING,
    location: DataTypes.STRING,
    round: DataTypes.INTEGER,
    votes: DataTypes.INTEGER
  });

  Photo.associate = function(models) {
    Photo.belongsTo(models.Player, {
      foreignKey: {
        allowNull: false
      }
    });

    Photo.belongsTo(models.Game, {
      foreignKey: {
        allowNull: false
      }
    });
    
    Photo.belongsTo(models.Player, {
      foreignKey: {
        name: "captionerId"
      }
    });
  };
  return Photo;
};