const express = require('express');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

const url = 'mongodb://localhost:27017';
const dbName = 'agenda';
let db;

async function conectarMongoDB() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        db = client.db(dbName);
        console.log(`Conectado ao banco de dados: ${dbName}`);
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
    }
}
conectarMongoDB();

app.use(express.static(path.join(__dirname, 'public')));

// Configurações do Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'INSERIR_EMAIL@gmail.com',
        pass: 'xxxxxxxxx',
    }
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/formulario', (req, res) => {
    res.render('formulario');
});

app.post('/submit-formulario', async (req, res) => {
    const { nome, cpf, email, qtdPessoas, dataReserva, horarioReserva, setor } = req.body;

    const reserva = {
        nome,
        cpf,
        email,
        qtdPessoas,
        data: dataReserva,
        horario: horarioReserva,
        setor,
        status: 'confirmada' 
    };

    try {
        const result = await db.collection('reservas').insertOne(reserva);
        enviarEmailConfirmacao(reserva);
        agendarLembrete(reserva);
        res.redirect('/'); 
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer reserva', error });
    }
});

// Função para enviar o e-mail de confirmação
function enviarEmailConfirmacao(reserva) {
    const { nome, email, data, horario, setor } = reserva;

    const mailOptions = {
        from: 'INSERIR_EMAIL@gmail.com',
        to: email,
        subject: 'Confirmação de Reserva',
        text: `Olá ${nome},

Sua reserva foi confirmada.

Detalhes da reserva:
- Data: ${data}
- Horário: ${horario}
- Setor: ${setor}

Estamos ansiosos para recebê-lo.

Atenciosamente,
Equipe do Restaurante
        `,
        html: `<h1>Confirmação de Reserva</h1>
        <p>Olá <strong>${nome}</strong>,</p>
        <p>Sua reserva foi confirmada.</p>
        <h2>Detalhes da reserva:</h2>
        <ul>
            <li><strong>Data:</strong> ${data}</li>
            <li><strong>Horário:</strong> ${horario}</li>
            <li><strong>Setor:</strong> ${setor}</li>
        </ul>
        <p>Estamos ansiosos para recebê-lo.</p>
        <p>Atenciosamente,<br>Equipe do Restaurante</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erro ao enviar e-mail de confirmação:', error);
        } else {
            console.log('E-mail de confirmação enviado:', info.response);
        }
    });
}

// Função para agendar o e-mail de lembrete
function agendarLembrete(reserva) {
    const { email, nome, data, horario, setor } = reserva;

    const horarioReserva = new Date(`${data}T${horario}`);
    const lembreteHorario = new Date(horarioReserva.getTime() - 60 * 60 * 1000);

    cron.schedule(`${lembreteHorario.getMinutes()} ${lembreteHorario.getHours()} ${lembreteHorario.getDate()} ${lembreteHorario.getMonth() + 1} *`, () => {
        const mailOptions = {
            from: 'INSERIR_EMAIL@gmail.com',
            to: email,
            subject: 'Lembrete: Sua reserva está próxima',
            text: `Olá ${nome},

Estamos enviando este lembrete para avisar que sua reserva ocorrerá em 1 hora.

Detalhes da reserva:
- Data: ${data}
- Horário: ${horario}
- Setor: ${setor}

Esperamos vê-lo em breve.

Atenciosamente,
Equipe do Restaurante
            `,
            html: `<h1>Lembrete de Reserva</h1>
            <p>Olá <strong>${nome}</strong>,</p>
            <p>Estamos enviando este lembrete para avisar que sua reserva ocorrerá em 1 hora.</p>
            <h2>Detalhes da reserva:</h2>
            <ul>
                <li><strong>Data:</strong> ${data}</li>
                <li><strong>Horário:</strong> ${horario}</li>
                <li><strong>Setor:</strong> ${setor}</li>
            </ul>
            <p>Esperamos vê-lo em breve.</p>
            <p>Atenciosamente,<br>Equipe do Restaurante</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Erro ao enviar e-mail de lembrete:', error);
            } else {
                console.log('E-mail de lembrete enviado:', info.response);
            }
        });
    });
}

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});