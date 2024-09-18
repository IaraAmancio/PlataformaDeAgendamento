const mongoose = require('mongoose')

const sectorModel = new mongoose.Schema({
    id_sector:{
        type: String,
        enum: ['Lounge Area', 'Internal Area', 'External Area']
    },
    capacity:{
        type: Number,
        enum: [10, 20, 30]
    },
    occupied_vacancies:{
        type: Number,
        default: 0,
        min: 0
    }
})

module.exports = sectorModel