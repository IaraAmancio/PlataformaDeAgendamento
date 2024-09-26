const nodemailer = require('nodemailer');
const cron = require('node-cron');

const emailEnvio = 'seu-email@gmail.com';

// Configurações do Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: `${emailEnvio}`,
        pass: 'senha aqui',
    }
});

// Função para enviar o e-mail de confirmação
function enviarEmailConfirmacao(reserva) {
    const { nome, email, data, qtdPessoas, setor } = reserva;

    const date = new Date(data);
    const dataFormatada = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;

    const mailOptions = {
        from: `${emailEnvio}`,
        to: email,
        subject: 'Confirmação de Reserva',
        text: `Olá ${nome},

Sua reserva foi confirmada.

Detalhes da reserva:
- Data: ${dataFormatada}
- Horário: A partir das 18h
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
            <li><strong>Data:</strong> ${dataFormatada}</li>
            <li><strong>Horário:</strong> A partir das 18h</li>
            <li><strong>Setor:</strong> ${setor}</li>
            <li><strong>Quantidade de pessoas:</strong> ${qtdPessoas}</li>
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
    const { email, nome, data, qtdPessoas, setor } = reserva;
    const date = new Date(data);
    const dataFormatada = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;

    // const horario = 18;

    // const horarioReserva = new Date(`${data}T${String(horario).padStart(2, '0')}:00:00`);
    // const lembreteHorario = new Date(horarioReserva.getTime() - 60 * 60 * 1000);

    
    // Demonstração de envio do e-mail de lembrete
    const horarioAtual = new Date();
    const lembreteHorario = new Date(horarioAtual.getTime() + 60 * 1000);

    const minutos = lembreteHorario.getMinutes();
    const horas = lembreteHorario.getHours();

    cron.schedule(`${minutos} ${horas} * * *`, () => {
        const mailOptions = {
            from: `${emailEnvio}`,
            to: email,
            subject: 'Lembrete: Sua reserva está próxima',
            text: `Olá ${nome},

Estamos enviando este lembrete para avisar que sua reserva ocorrerá em 1 hora.

Detalhes da reserva:
- Data: ${dataFormatada}
- Horário: A partir das 18h
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
                <li><strong>Data:</strong> ${dataFormatada}</li>
                <li><strong>Horário:</strong> A partir das 18h</li>
                <li><strong>Setor:</strong> ${setor}</li>
                <li><strong>Quantidade de pessoas:</strong> ${qtdPessoas}</li>
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
