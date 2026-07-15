// src/repositories/room.repository.js

const { Room } = require("../models");

async function findAll(filters = {}) {
    const where = {};

    if (filters.status !== undefined) {
        where.status = filters.status === 'true' || filters.status === true;
    }

    return Room.findAll({
        where,
        order: [['created_at', 'DESC']]
    });
}

async function findById(id) {
    return Room.findByPk(id);
}

async function findByName(name) {
    return Room.findOne({
        where: {
            name
        }
    });
}

async function create(payload) {
    return Room.create(payload);
}

async function updateById(id, payload) {
    const room = await Room.findByPk(id);

    if (!room) {
        return null;
    }

    await room.update(payload);

    return room;
}

async function deleteById(id) {
    const deletedRows = await Room.destroy({
        where: {
            id
        }
    });

    return deletedRows > 0;
}

module.exports = {
    findAll,
    findById,
    findByName,
    create,
    updateById,
    deleteById
};