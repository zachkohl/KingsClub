

config = require('./config'); 

config.app.get('/', function (req, res) {
    res.send('hello world!')
});//end '/'


login = require('./login.js')(config)

registration = require('./registration.js')(config);

signin = require('./signin.js')(config);


signout = require('./signout.js')(config);

s3Test = require('./S3Test.js')(config);

camera = require('./camera.js')(config);

updatePhoto = require('./updatePhoto.js')(config);



