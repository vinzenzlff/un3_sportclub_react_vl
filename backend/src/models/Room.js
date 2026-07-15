// src/models/room.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Room extends Model { }

Room.init(
    {
        id: {
            type:
                sequelize.getDialect() === 'mysql'
                    ? DataTypes.INTEGER.UNSIGNED
                    : DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 100]
            }
        },

        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [5, 255]
            }
        },

        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                isInt: true,
                min: 1
            }
        },

        location: {
            type: DataTypes.STRING(150),
            allowNull: true
        },

        image_url: {
            type: DataTypes.STRING(255),
            allowNull: true
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
        modelName: 'Room',
        tableName: 'rooms',
        timestamps: true,
        underscored: true
    }
);

module.exports = Room;