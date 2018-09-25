
//Express +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const express = require('express');
const helmet = require('helmet');
const path = require('path') ;
const PORT = process.env.PORT || 80;
const app = express(); 
app.use(helmet())
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json()); 
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'loggedout'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('static'));
app.listen(PORT, () => console.log('Example app listening on port 80!'))

//Database +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
if (app.get('env') === 'development') {
//   const { Pool, Client } = require('pg')

// var pool = new Pool({
// user: 'postgres',
// host: 'localhost',
// database: 'stargarnet',
// password: 'password',
// port: 5432,
// })

// var client = new Client({
// user: 'postgres',
// host: 'localhost',
// database: 'stargarnet',
// password: 'password',
// port: 5432,
// })
// client.connect()


var { Pool, Client } = require('pg')

var client = new Client({
connectionString: "postgres://dkiphcqrmtggcy:16964a97732117e2a346bc73d462c9e08bd599eb7ed5d04d4b540deef1749e2e@ec2-54-235-249-33.compute-1.amazonaws.com:5432/d1a8hqms7seu5l",
ssl: true,
});

var pool = new Pool({
connectionString: "postgres://dkiphcqrmtggcy:16964a97732117e2a346bc73d462c9e08bd599eb7ed5d04d4b540deef1749e2e@ec2-54-235-249-33.compute-1.amazonaws.com:5432/d1a8hqms7seu5l",
ssl: true,
});


client.connect();
}
else{

var { Pool, Client } = require('pg')

var client = new Client({
connectionString: process.env.DATABASE_URL,
ssl: true,
});

var pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: true,
});


client.connect();
}

function query(text, values,callback,errorLog) {
  //Query

 
  pool.query(text, values, (err, response) => {
    
    if (err) {
      // console.log(JSON.stringify(err.stack));
console.log(err.stack.split('\n',1)[0])
    } 
    else {
      if (response.rows) {
        callback(response); //must use var because we want function scope. 
      } 
      else {
        console.log('no rows')
        errorLog('no rows');
      };
      
      };//end else

  })//end pool.query
  
};//end query


//Session +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const session = require('express-session');
pgSession = require('connect-pg-simple')(session); //This all ends up encrypted on the client side. Used wireshark to check. 

var sess = {
  store: new pgSession({
    pool : pool,                // Connection pool
     // Use another table-name than the default "session" one
  }),
  secret: 'VERY VERY SECRET',
  cookie: {},
  resave: false,
  saveUninitialized: true
}
 
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
 
app.use(session(sess))

//Session stuff
//https://www.npmjs.com/package/express-session
//https://www.npmjs.com/package/connect-pg-simple
//https://www.tutorialspoint.com/expressjs/expressjs_authentication.htm (seems very good)

function checkSession(req, res, next) {
  if (req.session.user){ //Does the session exist? Recall that the express-session is using its own id system in the background to hook into a specific user profile. 
    res.locals.layout = "loggedin";
    next(); //https://stackoverflow.com/questions/10695629/what-is-the-parameter-next-used-for-in-express Basically next is a special object in express that passes control to the next MATCHING route
  } else {
    res.redirect('login');
    process.stdout.write('not logged in');

  }
};



//Export +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
config = {app, query, checkSession, pool}


module.exports = config;