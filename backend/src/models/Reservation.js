const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Reservation extends Model {}

Reservation.init(
  {
    id: {
      type: sequelize.getDialect() === 'mysql'
        ? DataTypes.INTEGER.UNSIGNED
        : DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    user_id: {
      type: sequelize.getDialect() === 'mysql'
        ? DataTypes.INTEGER.UNSIGNED
        : DataTypes.INTEGER,
      allowNull: false
    },

    class_schedule_id: {
      type: sequelize.getDialect() === 'mysql'
        ? DataTypes.INTEGER.UNSIGNED
        : DataTypes.INTEGER,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM('active', 'cancelled'),
      allowNull: false,
      defaultValue: 'active'
    },

    observation: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: true,
    underscored: true
  }
);

module.exports = Reservation;
