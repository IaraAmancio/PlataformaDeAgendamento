const mongoose = require('mongoose')

const reservationModel = mongoose.Schema({
    id_person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'person'
    },
    id_sector: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sector'
    },
    person_quantity: Number,
    date: Date,
    time: String
})

module.exports = reservationModel