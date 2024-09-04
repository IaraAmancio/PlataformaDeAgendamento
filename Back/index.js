const mongoose = require('mongoose')
const personModel = require('./person')
const sectorModel = require('./sector')
const reservationModel = require('./reservation')

mongoose.connect('mongodb://localhost:27017/restaurante')

mongoose.model('person', personModel)
mongoose.model('sector', sectorModel)
mongoose.model('reservation', reservationModel)