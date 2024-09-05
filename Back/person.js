const mongoose = require('mongoose')

const personModel = new mongoose.Schema({
    name: String,
    email: String,
    cpf: String
})

module.exports = personModel