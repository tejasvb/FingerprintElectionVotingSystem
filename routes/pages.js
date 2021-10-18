const express = require('express');
const router = express.Router();

router.get('/' , (req , res) =>{
    res.render('index');
});

router.get('/register' , (req , res) =>{
    //res.send("<h1>Home Page</h1>")
    res.render('register');
});

router.get('/login' , (req , res) =>{
    res.render('login');
});
router.get('/fingerprintDection' , (req , res) =>{
    res.render('fingerprintDection');
});
router.get('/vote' , (req , res) =>{
    res.render('vote');
});



module.exports = router;