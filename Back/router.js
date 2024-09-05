const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render("index");
});

router.get("/formulario", (req, res) => {
    res.render("formulario")
})

module.exports = router;
