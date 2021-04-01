const { connect } = require('mongoose');
const { Table } = require('../models/Table');

void connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const getTableBasicDetails = async (id) => {
    return await Table.findOne({ _id: id }, 'name description');
};

const getTable = async (id) => {
    return await Table.findOne({ _id: id });
};

const getAllTables = async () => {
    return await Table.find({}, 'name description');
};

const createNewTable = async (name, description, copyDataFrom) => {
    let initialData;

    if (copyDataFrom)
        initialData = await getTable(copyDataFrom).data;

    const tableCreated = await Table.create({
        name, description, data: initialData || {
            data: [[]],
            mergeCells: [],
        }
    });
    return tableCreated;
};

const updateTable = async (id, data) => {
    let table = await getTable(id);
    table.data = data;

    await table.save();
    return true;
};

const deleteTable = async (id) => {
    return await Table.deleteOne({ _id: id });
};

module.exports = {
    getTableBasicDetails,
    getTable,
    getAllTables,
    createNewTable,
    updateTable,
    deleteTable
};