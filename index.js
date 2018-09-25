

config = require('./config'); 

config.app.get('/', function (req, res) {
    res.send('hello world!')
});//end '/'


login = require('./login.js')(config)

registration = require('./registration.js')(config);

signinout = require('./signinout.js')(config)







