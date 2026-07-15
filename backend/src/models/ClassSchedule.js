// src/models/ClassSchedule.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ClassSchedule extends Model { }

ClassSchedule.init(
    {
        id: {
            type:
                sequelize.getDialect() === 'mysql'
                    ? DataTypes.INTEGER.UNSIGNED
                    : DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        sport_room_id: {
            type:
                sequelize.getDialect() === 'mysql'
                    ? DataTypes.INTEGER.UNSIGNED
                    : DataTypes.INTEGER,
            allowNull: false
        },

        day_of_week: {
            type: DataTypes.TINYINT,
            allowNull: false,
            validate: {
                min: 1,
                max: 7
            }
        },

        start_time: {
            type: DataTypes.TIME,
            allowNull: false
        },

        end_time: {
            type: DataTypes.TIME,
            allowNull: false
        },

        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: 'ClassSchedule',
        tableName: 'class_schedules',
        timestamps: true,
        underscored: true
    }
);

module.exports = ClassSchedule;