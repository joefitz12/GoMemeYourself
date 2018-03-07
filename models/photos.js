module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("Photo", {
    score: DataTypes.INTEGER,
    caption: DataTypes.STRING,
    location: DataTypes.STRING 
  });

  Photo.associate = function(models) {
    Photo.belongsTo(models.Player, {
      foreignKey: {
        name: "playerId",
        allowNull: false
      }
    });

    Photo.belongsTo(models.Player, {
      foreignKey: {
        name: "captionerId",
        allowNull: false
      }
    });
  };
  return Photo;
};

db.teamMember.belongsTo(db.employee, {as: 'SupervisorId'});
db.teamMember.belongsTo(db.employee, {as: 'RegularEmployeeId'});