const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/restaurante')

const express = require('express');
const app = express();

const path = require('path');

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname,'../Front/views'));
app.use(express.static(path.join(__dirname, '../Front/public')));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', require('./router'));


// Iniciar o servidor na porta 8080
app.listen(8080, () => {
    console.log('Servidor rodando em http://localhost:8080');
});
