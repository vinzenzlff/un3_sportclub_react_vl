// src/models/sportRoom.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class SportRoom extends Model { }

SportRoom.init(
    {
        id: {
            type:
                sequelize.getDialect() === 'mysql'
                    ? DataTypes.INTEGER.UNSIGNED
                    : DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        sport_id: {
            type:
                sequelize.getDialect() === 'mysql'
                    ? DataTypes.INTEGER.UNSIGNED
                    : DataTypes.INTEGER,
            allowNull: false
        },

        room_id: {
            type:
                sequelize.getDialect() === 'mysql'
                    ? DataTypes.INTEGER.UNSIGNED
                    : DataTypes.INTEGER,
            allowNull: false
        },

        coach_id: {
            type:
                sequelize.getDialect() === 'mysql'
                    ? DataTypes.INTEGER.UNSIGNED
                    : DataTypes.INTEGER,
            allowNull: false
        },

        observation: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: 'SportRoom',
        tableName: 'sport_rooms',
        timestamps: true,
        underscored: true
    }
);

module.exports = SportRoom;