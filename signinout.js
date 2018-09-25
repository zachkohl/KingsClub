
function routes(config) {
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;






    app.get('/x', function (req, res) {
        res.send('welcome to test page X!')
    });//end '/'



    //SIGN IN 
    app.get('/signin', checkSession, function (req, res) {
        res.render('signin', { message: "hello world" })
    })

    // app.get('/api/signin', checkSession, function (req, res) {

    //             res.send('is this needed')
    //             console.log('success')

    // }); 


    app.post('/api/signin', checkSession, function (req, res) {


        // console.log(req.body.adultName)
        let text = 'SELECT child_name,child.child_id FROM  adult_child INNER JOIN adult ON (adult.adult_id=adult_child.adult_id) INNER JOIN child ON (child.child_id=adult_child.child_id) WHERE adult.adult_name =$1';
        let values = [req.body.adultName];
        query(text, values, callback);
        function callback(data) {
            console.log(data.rows)
            package = JSON.stringify(data.rows)
            res.send(package)

        };//end callback

        //       let text = 'SELECT child_id FROM  adult_child, adult WHERE adult_child.adult_id = adult.adult_id ';
        //        let text = 'SELECT adult_id, child_id FROM adult_id INNER JOIN adult_id ON child_adult.adult_id = adult.adult_id';

        //let text = 'INSERT INTO adult_child (adult_id, child_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM adult_child WHERE adult_id = $1 AND child_id = $2)';
    });


    app.post('/api/signinChild', checkSession, function (req, res) {


        signinTime = new Date();


        let text = "DO $$ BEGIN IF (SELECT child.child_signedin FROM child WHERE child.child_name =  $1) IS TRUE THEN INSERT INTO signin (signin_child_id,signin_child_name,signin_intime)\
    VALUES ($1,$2,$3); END IF; END $$"
        let values = [req.body.childName, req.body.childId, signinTime];

        pool.query(text, values, (err, response) => {

            if (err) {
                // console.log(JSON.stringify(err.stack));
                console.log(err.stack.split('\n', 1)[0])
            }
            else {
                res.send('complete')

            };//end else

        })

        //   query(text, values, callback);
        //  function callback(data) {
        //  console.log(data.rows)
        //  package = JSON.stringify(data.rows)
        //  res.send('INSERT complete')

        //  };//end callback


        //      CREATE TABLE signin
        // (
        // signin_id serial PRIMARY KEY,
        // signin_child_id int NOT NULL,
        // signin_child_name VARCHAR (255),
        // signin_intime timestamptz NOT NULL,
        // signin_outtime timestamptz

        // );
    });





















}//end routes

module.exports = routes;  //VS code wants to change this to ES6, but the support does not seem to be their yet. Will just have to wait. 