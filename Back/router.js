const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const personModel = require('./person')
const sectorModel = require('./sector')
const reservationModel = require('./reservation')
const { enviarEmailConfirmacao, agendarLembrete } = require('./mailer')

const Person = mongoose.model('Person', personModel)
const Sector = mongoose.model('Sector', sectorModel)
const Reservation = mongoose.model('Reservation', reservationModel)

router.get('/', (req, res) => {
    res.render("index");
});

router.get("/formulario", (req, res) => {
    const { setor, data } = req.query; //body Recebe data e setor da query string
    res.render("formulario", { setor, data }); // Passa data e setor para a view
})

router.post('/submit-formulario', async (req, res) => {

    try {
        const {nome, cpf, email, qtdPessoas, horarioReserva, setor, data } = req.body;
        console.log(setor);
        console.log(data);
        console.log(nome);


        // Verifica se já existe a pessoa cadastrada no banco a partir do cpf     
        let person = await Person.findOne({ cpf });
        if (!person)  {
            person = new Person({name: nome, email: email, cpf: cpf});
            await person.save();
        }

        // Busca o id do setor no banco de acordo com o escolhido no formulário
        const sector = await Sector.findOne({ id_sector: setor });

        // Tratamento de dado para a data de reserva
        const reservaDate = new Date(data);
        console.log(reservaDate);
        if (isNaN(reservaDate.getTime())) {
            return res.status(400).send('Data inválida');
        }

        // Cria uma nova reserva
        const newReservation = new Reservation({
            id_person: person._id,
            id_sector: sector._id,
            person_quantity: qtdPessoas,
            date: reservaDate,
            time: horarioReserva
        });
        console.log(newReservation.id_person)
        // Salvar reserva
        await newReservation.save();

         // Envio de e-mail e agendamento de lembrete usando mailer.js
         enviarEmailConfirmacao({
            nome,
            email,
            data: data,
            horario: horarioReserva,
            setor: sector.id_sector
        });

        agendarLembrete({
            nome,
            email,
            data: data,
            horario: horarioReserva,
            setor: sector.id_sector
        });

        console.log('Reserva efetuada com sucesso!');

        res.redirect('/'); // Redireciona para a página inicial
    } catch (err) {
        console.error(err);
    }
})

router.get('/minhas-reservas', (req, res) => {
    res.render('minhas-reservas');
});

router.post('/submit-minhas-reservas', async (req, res) => {
    const cpf = req.body.cpf;
    try {
        const pessoa = await Person.findOne({ cpf });
        if (pessoa) {
            const reservas = await Reservation.find({ id_person: pessoa._id });
            
            // Buscando o setor manualmente
            const reservasComSetor = await Promise.all(reservas.map(async (reserva) => {
                const setor = await Sector.findById(reserva.id_sector);
                return {
                    ...reserva._doc,
                    setor: setor ? setor.id_sector : 'Setor não encontrado'
                };
            }));

            // Formatando Data
            const reservasComDataFormatada = reservasComSetor.map(reserva => {
                const date = new Date(reserva.date);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
                
                return {
                    ...reserva,
                    formattedDate,
                    time: reserva.time
                };
            });
            
            res.render('minhas-reservas', { reservasComDataFormatada });
        } else {
            res.render('minhas-reservas', { reservasComDataFormatada: [], message: 'CPF não encontrado' });
        }
    } catch (error) {
        res.status(500).send('Erro ao buscar reservas.');
    }
});

router.get('/qtd-reservas/:id_sector', (req, res) => {
    const { id_sector } = req.params;

    try{
        const vagasDisponiveis = sector.capacity - sector.occupied_vacancies;

        res.status(200).send({ vagasDisponiveis })
    }catch (error){
        res.status(500).send({ message: 'Não há vagas disponíveis', error });
    }
});

router.post('/preenchimento-nome', async (req, res) => {
    const { cpf } = req.body;
    try {
        const pessoa = await Person.findOne({ cpf: cpf });
        if (pessoa) {
            res.json({ success: true, nome: pessoa.name });
        } else {
            res.json({ success: false, message: 'CPF não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar CPF.' });
    }
});

module.exports = router;
