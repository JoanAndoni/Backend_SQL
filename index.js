import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import morgan from 'morgan';
require('dotenv').config()
import db from './config/database';

db.authenticate()
    .then(() => { console.log('Connected to the database') })
    .catch(err => { console.log('Database error: ' + err) });

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
import passportFunction from './config/passport';
passportFunction(passport);

// Routes
const users = require('./routes/users');
app.use('/users', users);

app.get('/', (req, res) => {
    res.status(400).send('Invalid Endpoint');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Server started on port ' + port);
});
