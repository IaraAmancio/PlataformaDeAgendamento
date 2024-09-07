const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const personModel = require('./person')
const sectorModel = require('./sector')
const reservationModel = require('./reservation')

const Person = mongoose.model('Person', personModel)
const Sector = mongoose.model('Sector', sectorModel)
const Reservation = mongoose.model('Reservation', reservationModel)

router.get('/', (req, res) => {
    res.render("index");
});

router.get("/formulario", (req, res) => {
    res.render("formulario")
})

router.post('/submit-formulario', async (req, res) => {
    try {
        const { nome, cpf, email, qtdPessoas, dataReserva, horarioReserva, setor } = req.body;

        // Verifica se já existe a pessoa cadastrada no banco a partir do cpf
        let person = await Person.findOne({ cpf });
        if (!person)  {
            person = new Person({name: nome, email: email, cpf: cpf});
            await person.save();
        }

        // Busca o id do setor no banco de acordo com o escolhido no formulário
        const sector = await Sector.findOne({ id_sector: setor });

        // Tratamento de dado para a data de reserva
        const reservaDate = new Date(dataReserva);
        if (isNaN(reservaDate.getTime())) {
            return res.status(400).send('Data inválida');
        }

        // Cria uma nova reserva
        const newReservation = new Reservation({
            id_person: person._id,
            id_sector: sector._id,
            person_quantity: qtdPessoas,
            date: new Date(dataReserva),
            time: horarioReserva
        });
        
        // Salvar reserva
        await newReservation.save();

        console.log('Reserva efetuada com sucesso!');

        res.redirect('/'); // Redireciona para a página inicial
    } catch (err) {
        console.error(err);
    }
})

module.exports = router;
