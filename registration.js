
function routes(config) {
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;






    app.get('/', function (req, res) {
        res.send('hello world!')
    });//end '/'



    //Registration 
    app.get('/registration', checkSession, function (req, res) {
        res.render('registration', { message: "hello world" })
    })

    app.post('/registration', checkSession, function (req, res) {
        adultNames = req.body.adultNames.split(',');
        childNames = req.body.childNames.split(',');


        //prep for crazy callback awesomeness
        let adultIDs = [];
        let childIDs = [];
        let InsertAdultCounter = 1;
        let InsertChildCounter = 1;
        

        for (i = 0; i < adultNames.length; i++) {
            let text = 'INSERT INTO adult (adult_name) VALUES ($1) ON CONFLICT (adult_name) DO UPDATE SET adult_name = $1 G *RETURNIN'
            let values = [adultNames[i]];
            query(text, values, callback);
            function callback(data) {

                if (InsertAdultCounter < adultNames.length) {
                    adultIDs.push(data.rows[0].adult_id);
                    InsertAdultCounter++;
                }
                else {
                    step2();
                }
            };//end call back  
        };//end for loop

        function step2() {
            console.log('completed adult database updates');

            for (i = 0; i < childNames.length; i++) {

                let text = 'INSERT INTO child (child_name) VALUES ($1) ON CONFLICT (child_name) DO UPDATE SET child_name = $1 RETURNING *';
                let values = [childNames[i]];
                query(text, values, callback);
                function callback(data) {

                    if (InsertChildCounter < childNames.length) {
                        childIDs.push(data.rows[0].child_id);
                        InsertChildCounter++;

                    }
                    else {
                        step3();
                    };//end else
                };//end callback
            };//end for
        };//end step 2

        function step3() {
            console.log('completed child database updates')
            let step3Counter = 2;
            let AdultAndChildNum = adultIDs.length + childIDs.length
            // console.log(adultIDs);
            // console.log(childIDs);
            // console.log('childIDs Length: ' + childIDs.length)
            for (let i = 0; i < adultIDs.length; i++) {
              //  console.log('ADULT ID:  ' + adultIDs[i]);

                for (j = 0; j < childIDs.length; j++) {
                    // console.log('childIDsLength: '+childIDs.length)
                    // console.log('J: ' + j)
                  //  console.log(Array.isArray(childIDs))
                    console.log('CHILDs[j]:  ' + childIDs[j]);
                    // Below is how one does a many to many insertion
                    let text = 'INSERT INTO adult_child (adult_id, child_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM adult_child WHERE adult_id = $1 AND child_id = $2)';
                    let values = [adultIDs[i], childIDs[j]];
                    query(text, values, callback)
                    function callback(data) {
                        if (step3Counter < AdultAndChildNum) {
                            step3Counter++;
                        }
                        else {
                            step4();
                        }
                    }//end call back

                }//end child for loop

            }//end adult for loop

        }//end step 3
function step4(){
    console.log('junction table updates complete')
    res.send('complete')
}//end step 4

    }); //end REGISTRATION POST

























}//end routes

module.exports = routes;  //VS code wants to change this to ES6, but the support does not seem to be their yet. Will just have to wait. 