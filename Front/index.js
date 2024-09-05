const express = require("express");
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/formulario", (req, res) => {
    res.render("formulario");
});

app.listen(8080, () => {
    console.log("App rodando!");
});
