const express = require('express');
const path = require('path');
const mysql = require("mysql");
const dotenv = require("dotenv");

const cookieParser = require('cookie-parser');
dotenv.config({path: "./.env"});

const app = express();
app.use(cookieParser());
const db = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//parse url encoded bodies( as sent by html forms)
app.use(express.urlencoded({extended: false}));

//parse json bodies (as sent by API clients)
app.use(express.json());

console.log(__dirname);
app.set('view engine' , 'hbs');

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});


//Define Routes
app.use('/' , require('./routes/pages'));
app.use('/auth' , require('./routes/auth'));


app.listen('5000' , () => {
    console.log('Server started on port 5000');
});