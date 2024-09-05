const mongoose = require('mongoose')

const sectorModel = new mongoose.Schema({
    id_sector:{
        type: String,
        enum: ['Lounge Area', 'Internal Area', 'External Area']
    },
    capacity:{
        type: Number,
        enum: [10, 20, 30]
    }
})

module.exports = sectorModel