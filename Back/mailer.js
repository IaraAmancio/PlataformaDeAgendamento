const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Configurações do Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'InserirEmail@gmail.com',
        pass: 'xxxxxxxxx',
    }
});

// Função para enviar o e-mail de confirmação
function enviarEmailConfirmacao(reserva) {
    const { nome, email, data, horario, setor } = reserva;

    const mailOptions = {
        from: 'InserirEMail@gmail.com',
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
            <li><strong>Horário:</strong> A partir das ${horario}</li>
            <li><strong>Setor:</strong> ${setor}</li>
        </ul>
        <p>Estamos ansiosos para recebê-lo.</p>
        <p>Atenciosamente,<br>Equipe do Restaurante</p>`
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log('Erro ao enviar e-mail de confirmação:', error);
        } else {
            console.log('E-mail de confirmação enviado!');
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
            from: 'InserirEMail@gmail.com',
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
                <li><strong>Horário:</strong> A partir das ${horario}</li>
                <li><strong>Setor:</strong> ${setor}</li>
            </ul>
            <p>Esperamos vê-lo em breve.</p>
            <p>Atenciosamente,<br>Equipe do Restaurante</p>`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log('Erro ao enviar e-mail de lembrete:', error);
            } else {
                console.log('E-mail de lembrete enviado!');
            }
        });
    });
}

module.exports = {
    enviarEmailConfirmacao,
    agendarLembrete
};
