const express = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes.js');


const app = express();

app.use(cors());
app.use(BodyParser.json());


app.use(BodyParser.urlencoded({ extended: true}));

app.use(express.static('public'));




app.get('/', (req, res) => { res.send('Welcome To GYM') ; res.end();});
app.use('/api/user', userRoutes);




module.exports = { app };