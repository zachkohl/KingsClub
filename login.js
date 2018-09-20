
function login(config){
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;
    pool = config.pool;

//___________________________REGISTRATION____________________________________
var bcrypt = require('bcrypt');

app.get('/register', function (req, res) { //This is how you render views (views are like templates in Jinga/Flask)
    res.render('register') //Must use this dictonary looking thing, format appears to be [variable used in view]:[current scope variable or a hard coded value]. 
  })
  
  
  app.post('/register', function(req, res) {
    if(!req.body.phone){ //phone validation
      res.render('register', { message: 'please enter a valid phone number' })
    }
    else{
    
    bcrypt.hash(req.body.password, 10, function(err, hash) { //This code won't fire till the hash variable is ready, this is called a "callback." Now we will only store things in the database once everything is read to go. 
      if (err) {
        console.log(err)
        process.stdout.write('error hashing password')
      } else{
        
      //Query
      
      phoneNumber = req.body.phone;
      let text = 'INSERT INTO users(username, email, phone,storedHash) VALUES($1, $2, $3, $4) RETURNING *' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 
      let values = [req.body.username,req.body.email,phoneNumber,hash]
      
      let response = res; //create a globalish variable. 
      pool.query(text, values, (err, res) => {
        if (err) {
          console.log(err.stack)
          process.stdout.write('Already have a user by this name')
          response.redirect('/');
        } else {
          console.log(res.rows[0])
          req.session.user = req.body.username; //NewUser is the username provided by the form.
          response.redirect('/');
        }
      })//end query
  
      }//end else
  
    }); //end hashing function
  };//end phone validation
  
  });// end app.post
  
  app.get('/login', function (req, res) { 
    res.render('login') 
  })
  
  
  app.post('/login', function(req, res) {
    
   
    req.session.user = req.body.username; //NewUser is the username provided by the form.
  //Another example quiery
  let text = 'SELECT * FROM users WHERE username = $1' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 
  let values = [req.body.username]
  let response = res; //create a globalish variable. 
  pool.query(text, values, (err, res) => {
    if (err) {
      console.log(err.stack)
      process.stdout.write('Username is not registered')
      response.render('login');
    } 
    else {
      if (res.rows[0]) {
      console.log(res.rows[0].id)
      console.log(res.rows[0].storedhash)
  
      bcrypt.compare(req.body.password, res.rows[0].storedhash, function(err, res) {
        if (err) {
          console.log(err.stack);
          process.stdout.write('error compairing passwords');
          response.render('login');
  
        } else {
          if(res){
          req.session.user = req.body.username; 
          console.log('login success');
          title = 'login success';
          response.redirect('/');
          //response.render('login');
          }
          else{
            console.log('password fail');
            response.render('login');
          }
          }
       });  
      
      }
      else{
        console.log('search resulted in zero')
        response.render('login');
      }
    }
  })//end query
  
  // res.render('login');
  //   //res.redirect('secure_page')
  //   x = hash;
  //   process.stdout.write('post function works');
  
  
  
  
  });// end app.post
  

}//end login

module.exports = login;