const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,'checkFingerprint' + path.extname(file.originalname));
    }
  });
  const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('fingerprintUpload');

  function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|bmp/;
  
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }
const db = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
});

exports.register = async(req , res) => {
    console.log(req.body);

   const voter_id = req.body.voter_id;    
   const name = req.body.name;
   const surname = req.body.surname;
   const middlename = req.body.middlename;
   const gender = req.body.gender;
   const birthdate = req.body.birthdate;
   const address = req.body.address;
   const contact_no = req.body.contact_no;
   const email = req.body.email;
   const password = req.body.password;
   const hashedPassword = await bcrypt.hash(req.body.password , 10);
   const passwordConfirm = req.body.passwordConfirm;
   const values = { contact_no: contact_no , email: email , password: hashedPassword , signed_up: 1 }

    db.query('SELECT voter_id FROM voter WHERE voter_id = ?' , [voter_id] , (error , results) => {

        if(error){
            console.log(error);
        }

        if(results.length === 0){
            return res.render('register' , {
            message: 'Voter ID does not exist'
            })
        }else {  db.query('SELECT signed_up FROM voter WHERE voter_id = ?' , [voter_id] , (error , results) => {
             
            if(error){
                console.log(error);
            }

            if(results[0].signed_up === 1){
                return res.render('register', {
                message: 'Already Signed Up'    
                });
            }else{ 
                db.query('SELECT name , surname , middle_name , gender  FROM voter WHERE voter_id = ?' , [voter_id] , (error , results) => {

                    if(error){
                    console.log(error);
                    }

                    if(results[0].name !== name || results[0].surname !== surname || results[0].middle_name !== middlename || results[0].gender !== gender ){
                        return res.render('register', {
                         message: 'Wrong Information'  
                        })
                    }else if(password !== passwordConfirm){
                        return res.render('register', {
                        message: 'Passwords Dont Match'  
                    })
                   }
                   else{
                    db.query('UPDATE voter SET ? WHERE voter_id = ? ' , [values , voter_id] , (error , results) => {
                        if(error){
                            console.log(error);
                        }else{
                            console.log(results);
                            return res.render('register' , {
                                message: ' Dear Voter You Are Signed Up'
                            } );
                        }
            
                    })
                   }
                })
                 }
        })
            
        }


        
    })

};
exports.login = async(req,res)=> {
    const voter_id = req.body.voter_id;   
    db.query('SELECT voter_id FROM voter WHERE voter_id = ?' , [voter_id] , (error , results) => {

        if(error){
            console.log(error);
            return res.render('login' , {
            message: 'some unexpeced error'
        })
        }

        if(results.length === 0){
            return res.render('login' , {
            message: 'Voter ID does not exist'
            });
        }else {  db.query('SELECT password FROM voter WHERE voter_id = ?' , [voter_id] , (error , results) => {
             
            if(error){
                console.log(error);
                return res.render('login' , {
                    message: 'some unexpeced error'
                });
            }

            if(bcrypt.compare(req.body.password,results[0].password)){
                db.query('SELECT signed_up,voted_party FROM voter WHERE voter_id = ?' , [voter_id] , (error , results) => {
             
                    if(error){
                        console.log(error);
                        return res.render('login' , {
                            message: 'some unexpeced error'
                        });
                    }
                    if(results[0].voted_party==null){
                        if(results[0].signed_up == 1){
                            res.cookie("voter_id", voter_id);
                            return res.render('fingerprintDection');
                        }
                        else{
                            return res.render('login' , {
                                message: 'You have to sign in first'
                              });
                        }
                       
                }  
                    else{ 
                        return res.render('login' , {
                            message: 'You are already Voted'
                          });
                        }
                });
                    
         
        }
            else{ 
                return res.render('login' , {
                    message: 'wrong password'
                  });
                }
        });
            
        }


        
    });
};

exports.fingerprintDection = (req,res)=>{
if(req.cookies.voter_id!=null){
    upload(req, res, (err) => {
        if(err){
            console.log('err');
            res.render('fingerprintDection', {
            msg: err
          });
        } else {
            
          if(req.file == undefined){
            res.render('fingerprintDection', {
              message: 'Error: No File Selected!'
            });
          } else {
             callName(req.cookies.voter_id,req.file.filename,res);
          }
        }
      });
}



    
};
exports.vote = (req,res)=>{
    if(req.cookies.voter_id!=null){
    party_id = req.body.btnradio;
    db.query('SELECT vote_count FROM parties WHERE party = ?' , [party_id] , (error , results) => {
        if(error){
            console.log(error);
            return res.render('vote' , {
            message: 'some unexpeced error'
        });
        }

        if(results.length === 0){
            return res.render('vote' , {
            message: 'Party does not exist'
            });
        }else {  
            var vote_count = results[0].vote_count+1;
            db.query('UPDATE parties SET vote_count=? WHERE party = ? ' , [vote_count , party_id] , (error , results) => {
                if(error){
                    console.log(error);
                }else{
                    db.query('UPDATE voter SET voted_party=? WHERE voter_id = ? ' , [party_id , req.cookies.voter_id] , (error , results) => {
                        if(error){
                            console.log(error);
                        }else{
                         res.clearCookie("voter_id");
                            return res.render('index' , {
                                message: 'Your vote is noted.. '
                            } );
                        }
            
                    });
                }
    
            })
             }
        });
    }
    else{
        return res.render('index' , {
            message: 'Please login in before voting'
    
            });
    }

            
    };
function callName(voter_id,filename,res) {
    const { spawn } = require('child_process');

    const pyProg = spawn('python', ['./FingerprintDectection/fingerprintIdentification.py',voter_id,filename]);
    pyProg.stdout.on('data', function(data) {
        console.log(data.toString());  
        if(data==1){
            res.render('vote');
        }
        else{
            console.log('data');
            res.render('fingerprintDection', {
                message: 'Fingerprint authentication failed please try again'
              });
        }
       
     
    });

}