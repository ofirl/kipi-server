const { Schema, model } = require("mongoose");

const tableDefinitionScheme = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: String,
    data: {
        data: [[String]],
        mergeCells: [String],
    },
});

const Table = model('Table', tableDefinitionScheme);

module.exports = {
    Table
};