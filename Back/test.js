const mongoose = require('mongoose');
const personModel = require('./person')
const sectorModel = require('./sector')
const reservationModel = require('./reservation')

const Person = mongoose.model('Person', personModel)
const Sector = mongoose.model('Sector', sectorModel)
const Reservation = mongoose.model('Reservation', reservationModel)

// Conectar ao banco de dados MongoDB
mongoose.connect('mongodb://localhost:27017/restaurante', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar no MongoDB', err));

async function criarReserva() {
    try {
        // Criar uma nova pessoa (ou referenciar uma existente)
        const novaPessoa = new Person({
            name: 'Gabriel Santiago',
            email: 'gabriel.santiago@email.com',
            cpf: '123.456.789-00'
        });
        const pessoaSalva = await novaPessoa.save();

        // Criar um novo setor (ou referenciar um existente)
        const novoSetor = new Sector({
            id_sector: 'Lounge Area'
        });
        const setorSalvo = await novoSetor.save();

        // Criar uma nova reserva com referência para pessoa e setor
        const novaReserva = new Reservation({
            id_person: pessoaSalva._id,   // Referência à pessoa criada
            id_sector: setorSalvo._id,    // Referência ao setor criado
            person_quantity: 4,           // Número de pessoas na reserva
            date: new Date(),             // Data atual
            time: '19:30'                 // Horário da reserva
        });

        const reservaSalva = await novaReserva.save();
        console.log('Reserva criada com sucesso:', reservaSalva);
    } catch (error) {
        console.error('Erro ao criar a reserva:', error);
    } finally {
        mongoose.connection.close();
    }
}

criarReserva();