
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
        let text = 'SELECT child_name,child.child_id,child_signedin FROM  adult_child INNER JOIN adult ON (adult.adult_id=adult_child.adult_id) INNER JOIN child ON (child.child_id=adult_child.child_id) WHERE adult.adult_name =$1 AND child_signedin = FALSE';
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
step1();
function step1(){
    let text = 'SELECT child_signedin FROM child WHERE child_name = $1';
    let values = [req.body.childName];
    query(text, values, callback);
    function callback(data) {
        console.log(data.rows)
        if(!data.rows[0].child_signedin){
            step2();
        }else{
            res.send('child already signed in')
        }
    }//end callback
};//END step 1

function step2(){
    let text = 'UPDATE child SET child_signedin = TRUE WHERE child_name = $1';
let values = [req.body.childName];
query(text, values, callback);
function callback(data) {
    step3();
}
}; //end step 2


// -- signin_child_id int NOT NULL,
// -- signin_child_name VARCHAR (255),
// -- signin_intime timestamptz NOT NULL,


function step3(){
    let nowTime = new Date();
    let text = 'INSERT INTO signin (signin_child_id, signin_child_name,signin_intime) VALUES ($1,$2,$3)';
let values = [req.body.childId,req.body.childName,nowTime];
query(text, values, callback);
function callback(data) {
   res.send('child signed in')
}
}//end step 3
      
    });//end app.post























}//end routes

module.exports = routes;  //VS code wants to change this to ES6, but the support does not seem to be their yet. Will just have to wait. 